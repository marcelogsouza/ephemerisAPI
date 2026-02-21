import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, SIDEREAL_MODES, FLAGS, getZodiacSign, ASPECTS, DEFAULT_ORBS, normalizeBodyKey, POINT_KEYS } from '../swisseph/constants.js';
import type { NatalChartRequest, NatalChartResponse, PlanetPosition, HouseData, AspectData } from '../swisseph/types.js';
import { calculateFortuna } from './fortuna.service.js';

const ASPECT_EPSILON = 0.01; // tolerance to avoid losing borderline aspects due to rounding
const normalizeLongitude = (value: number): number => ((value % 360) + 360) % 360;

const DEFAULT_PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'true_node', 'mean_apogee', 'chiron', 'fortuna',
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

  const requestedKeys = (input.planets ?? DEFAULT_PLANETS).map(normalizeBodyKey);
  const wantsFortuna = requestedKeys.some((key) => POINT_KEYS.has(key));
  const planetKeys = requestedKeys.filter((key) => !POINT_KEYS.has(key));

  const planets: PlanetPosition[] = [];
  const aspectPlanets: PlanetPosition[] = [];
  for (const key of planetKeys) {
    const id = PLANETS[key];
    if (id === undefined) continue;
    const pos = swe.calc_ut(jd, id, flags);
    const longitude = normalizeLongitude(pos[0]);
    const { sign, degree: signDegree } = getZodiacSign(longitude);
    const planet: PlanetPosition = {
      id,
      name: swe.get_planet_name(id),
      longitude,
      latitude: pos[1],
      distance: pos[2],
      speed: pos[3],
      sign,
      signDegree,
      retrograde: pos[3] < 0,
      type: 'planet',
    };
    planets.push(planet);
    aspectPlanets.push(planet);
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

  const fortuna = wantsFortuna
    ? calculateFortuna(swe, jd, input.latitude, input.longitude, flags, system)
    : null;
  if (fortuna) planets.push(fortuna);

  const ascendantLongitude = normalizeLongitude(houses.angles.ascendant);
  const mcLongitude = normalizeLongitude(houses.angles.mc);

  type AspectBody = { name: string; longitude: number; speed: number; type: 'planet' | 'point' };
  const aspectBodies: AspectBody[] = [
    ...aspectPlanets.map((planet) => ({
      name: planet.name,
      longitude: planet.longitude,
      speed: planet.speed,
      type: 'planet',
    })),
    { name: 'Ascendant', longitude: ascendantLongitude, speed: 0, type: 'point' },
    { name: 'MC', longitude: mcLongitude, speed: 0, type: 'point' },
    ...(fortuna
      ? [{ name: fortuna.name, longitude: fortuna.longitude, speed: fortuna.speed, type: 'point' as const }]
      : []),
  ];

  const aspectKeys = input.aspects ?? Object.keys(ASPECTS);
  const orbs = { ...DEFAULT_ORBS, ...(input.aspectOrbs ?? {}) };
  const aspects: AspectData[] = [];
  for (let i = 0; i < aspectBodies.length; i++) {
    for (let j = i + 1; j < aspectBodies.length; j++) {
      const p1 = aspectBodies[i];
      const p2 = aspectBodies[j];
      if (p1.type === 'point' && p2.type === 'point') continue;

      const rawDiff = Math.abs(p1.longitude - p2.longitude);
      let angle = rawDiff;
      if (angle > 180) angle = 360 - angle;

      for (const aspectKey of aspectKeys) {
        const exactAngle = ASPECTS[aspectKey.toLowerCase()];
        if (exactAngle === undefined) continue;
        const maxOrb = orbs[aspectKey.toLowerCase()] ?? 8;
        const orb = Math.abs(angle - exactAngle);
        if (orb <= maxOrb + ASPECT_EPSILON) {
          const speedDiff = p1.speed - p2.speed;
          const applying = exactAngle === 0
            ? rawDiff > 180
              ? speedDiff > 0
              : speedDiff < 0
            : angle < exactAngle
              ? speedDiff < 0
              : speedDiff > 0;

          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: aspectKey.toLowerCase(),
            exactAngle,
            actualAngle: angle,
            orb: Math.round(orb * 1000) / 1000,
            applying,
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
