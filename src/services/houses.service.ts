import { getSwissEph } from '../swisseph/singleton.js';
import { HOUSE_SYSTEMS, getZodiacSign } from '../swisseph/constants.js';
import type { HouseData } from '../swisseph/types.js';

export async function getHouseCusps(
  year: number, month: number, day: number, hour: number,
  latitude: number, longitude: number, system: string = 'P',
): Promise<HouseData> {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const result = swe.houses(jd, latitude, longitude, system);

  const cusps: number[] = [];
  for (let i = 1; i <= 12; i++) {
    cusps.push(result.cusps[i]);
  }

  return {
    cusps,
    angles: {
      ascendant: result.ascmc[0],
      mc: result.ascmc[1],
      armc: result.ascmc[2],
      vertex: result.ascmc[3],
      equatorialAscendant: result.ascmc[4],
      coAscendant1: result.ascmc[5],
      coAscendant2: result.ascmc[6],
      polarAscendant: result.ascmc[7],
    },
  };
}

export function getHouseSystems(): Record<string, string> {
  return { ...HOUSE_SYSTEMS };
}

export async function getHousePosition(
  year: number, month: number, day: number, hour: number,
  latitude: number, longitude: number,
  planetLongitude: number, planetLatitude: number,
  system: string = 'P',
): Promise<number> {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const armc = swe.sidtime(jd) * 15;
  const eps = 23.4393; // approximate obliquity
  return swe.house_pos(armc, latitude, eps, system, planetLongitude, planetLatitude);
}
