import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, getZodiacSign, FLAGS, normalizeBodyKey, POINT_KEYS, PLANET_ALIASES } from '../swisseph/constants.js';
import type { PlanetPosition } from '../swisseph/types.js';
import { calculateFortuna } from './fortuna.service.js';

export async function getPlanetPositions(
  year: number, month: number, day: number, hour: number,
  planetKeys: string[], flags: number = FLAGS.SWIEPH | FLAGS.SPEED,
  options?: { latitude?: number; longitude?: number; houseSystem?: string },
): Promise<PlanetPosition[]> {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const results: PlanetPosition[] = [];

  const normalizedKeys = planetKeys.map(normalizeBodyKey);
  const wantsFortuna = normalizedKeys.some((key) => POINT_KEYS.has(key));

  for (const key of normalizedKeys) {
    if (POINT_KEYS.has(key)) continue;
    const id = PLANETS[key];
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
      type: 'planet',
    });
  }

  if (wantsFortuna) {
    if (options?.latitude == null || options?.longitude == null) {
      throw new Error('Fortuna requires latitude and longitude.');
    }
    results.push(calculateFortuna(
      swe,
      jd,
      options.latitude,
      options.longitude,
      flags,
      options.houseSystem ?? 'P',
    ));
  }

  return results;
}

export async function getPlanetNames(): Promise<Record<string, number>> {
  const aliasEntries = Object.entries(PLANET_ALIASES)
    .map(([alias, key]) => [alias, PLANETS[key]] as const)
    .filter(([, id]) => id !== undefined);
  return { ...PLANETS, ...Object.fromEntries(aliasEntries), fortuna: -1 };
}
