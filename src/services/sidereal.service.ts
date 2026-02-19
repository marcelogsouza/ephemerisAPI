import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, SIDEREAL_MODES, FLAGS, getZodiacSign } from '../swisseph/constants.js';
import type { PlanetPosition } from '../swisseph/types.js';

export async function getSiderealPositions(
  year: number, month: number, day: number, hour: number,
  planetKeys: string[], ayanamsaKey: string = 'lahiri',
): Promise<PlanetPosition[]> {
  const swe = await getSwissEph();
  const sidMode = SIDEREAL_MODES[ayanamsaKey.toLowerCase()] ?? 1;
  swe.set_sid_mode(sidMode, 0, 0);
  const jd = swe.julday(year, month, day, hour);
  const flags = FLAGS.SWIEPH | FLAGS.SPEED | FLAGS.SIDEREAL;

  const results: PlanetPosition[] = [];
  for (const key of planetKeys) {
    const id = PLANETS[key.toLowerCase()];
    if (id === undefined) continue;
    const pos = swe.calc_ut(jd, id, flags);
    const { sign, degree: signDegree } = getZodiacSign(pos[0]);
    results.push({
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

  return results;
}

export async function getAyanamsaValue(
  year: number, month: number, day: number, hour: number,
  ayanamsaKey: string = 'lahiri',
) {
  const swe = await getSwissEph();
  const sidMode = SIDEREAL_MODES[ayanamsaKey.toLowerCase()] ?? 1;
  swe.set_sid_mode(sidMode, 0, 0);
  const jd = swe.julday(year, month, day, hour);
  const ayanamsa = swe.get_ayanamsa(jd);
  return { ayanamsa, system: ayanamsaKey, sidMode };
}

export function getSiderealSystems(): Record<string, number> {
  return { ...SIDEREAL_MODES };
}
