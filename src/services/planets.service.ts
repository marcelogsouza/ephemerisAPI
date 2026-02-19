import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, getZodiacSign, FLAGS } from '../swisseph/constants.js';
import type { PlanetPosition } from '../swisseph/types.js';

export async function getPlanetPositions(
  year: number, month: number, day: number, hour: number,
  planetKeys: string[], flags: number = FLAGS.SWIEPH | FLAGS.SPEED,
): Promise<PlanetPosition[]> {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
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

export async function getPlanetNames(): Promise<Record<string, number>> {
  return { ...PLANETS };
}
