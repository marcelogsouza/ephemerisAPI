import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, SIDEREAL_MODES, FLAGS, getZodiacSign, ASPECTS, DEFAULT_ORBS } from '../swisseph/constants.js';
import type { NatalChartRequest, NatalChartResponse, PlanetPosition, HouseData, AspectData } from '../swisseph/types.js';

const DEFAULT_PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'true_node', 'mean_apogee', 'chiron',
];

export async function calculateNatalChart(input: NatalChartRequest): Promise<NatalChartResponse> {
  const swe = await getSwissEph();

  const utcHour = input.hour + (input.minute || 0) / 60 + (input.second || 0) / 3600 - input.timezone;
  const jd = swe.julday(input.year, input.month, input.day, utcHour);

  let flags = FLAGS.SWIEPH | FLAGS.SPEED;
  if (input.zodiacType === 'sidereal') {
    const sidMode = SIDEREAL_MODES[input.ayanamsa?.toLowerCase() ?? 'lahiri'] ?? 1;
    swe.set_sid_mode(sidMode, 0, 0);
    flags |= FLAGS.SIDEREAL;
  }

  const planetKeys = input.planets ?? DEFAULT_PLANETS;
  const planets: PlanetPosition[] = [];
  for (const key of planetKeys) {
    const id = PLANETS[key.toLowerCase()];
    if (id === undefined) continue;
    const pos = swe.calc_ut(jd, id, flags);
    const { sign, degree: signDegree } = getZodiacSign(pos[0]);
    planets.push({
      id,
      name: swe.get_planet_name(id),
      longitude: pos[0],
      latitude: pos[1],
      distance: pos[2],
      speed: pos[3],
      sign,
      signDegree,
      retrograde: pos[3] < 0,
    });
  }

  const system = input.houseSystem ?? 'P';
  const houseResult = swe.houses(jd, input.latitude, input.longitude, system);
  const cusps: number[] = [];
  for (let i = 1; i <= 12; i++) {
    cusps.push(houseResult.cusps[i]);
  }
  const houses: HouseData = {
    cusps,
    angles: {
      ascendant: houseResult.ascmc[0],
      mc: houseResult.ascmc[1],
      armc: houseResult.ascmc[2],
      vertex: houseResult.ascmc[3],
      equatorialAscendant: houseResult.ascmc[4],
      coAscendant1: houseResult.ascmc[5],
      coAscendant2: houseResult.ascmc[6],
      polarAscendant: houseResult.ascmc[7],
    },
  };

  const aspectKeys = input.aspects ?? Object.keys(ASPECTS);
  const aspects: AspectData[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      let angle = Math.abs(p1.longitude - p2.longitude);
      if (angle > 180) angle = 360 - angle;

      for (const aspectKey of aspectKeys) {
        const exactAngle = ASPECTS[aspectKey.toLowerCase()];
        if (exactAngle === undefined) continue;
        const maxOrb = DEFAULT_ORBS[aspectKey.toLowerCase()] ?? 8;
        const orb = Math.abs(angle - exactAngle);
        if (orb <= maxOrb) {
          const speedDiff = p1.speed - p2.speed;
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: aspectKey.toLowerCase(),
            exactAngle,
            actualAngle: angle,
            orb: Math.round(orb * 1000) / 1000,
            applying: angle < exactAngle ? speedDiff < 0 : speedDiff > 0,
          });
        }
      }
    }
  }

  return {
    input,
    julianDay: jd,
    planets,
    houses,
    aspects,
  };
}
