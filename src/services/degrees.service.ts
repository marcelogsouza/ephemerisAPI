import { getSwissEph } from '../swisseph/singleton.js';

export async function normalizeDegree(degree: number) {
  const swe = await getSwissEph();
  return { normalized: swe.degnorm(degree) };
}

export async function splitDegree(degree: number, roundFlag: number = 1) {
  const swe = await getSwissEph();
  return swe.split_deg(degree, roundFlag);
}
