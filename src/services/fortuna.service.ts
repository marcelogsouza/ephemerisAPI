import type SwissEphType from 'swisseph-wasm';
import { PLANETS, getZodiacSign } from '../swisseph/constants.js';
import type { PlanetPosition } from '../swisseph/types.js';

const OBLIQUITY_EPSILON = 23.4393; // approximate obliquity

function normalize360(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function calculateFortuna(
  swe: SwissEphType,
  jd: number,
  latitude: number,
  longitude: number,
  flags: number,
  houseSystem: string = 'P',
): PlanetPosition {
  const sun = swe.calc_ut(jd, PLANETS.sun, flags);
  const moon = swe.calc_ut(jd, PLANETS.moon, flags);

  const houses = swe.houses(jd, latitude, longitude, houseSystem);
  const ascendant = houses.ascmc[0];

  const armc = swe.sidtime(jd) * 15;
  const sunHousePos = swe.house_pos(armc, latitude, OBLIQUITY_EPSILON, houseSystem, sun[0], sun[1]);
  const isDayChart = sunHousePos >= 7;

  const fortuna = normalize360(
    ascendant + (isDayChart ? (moon[0] - sun[0]) : (sun[0] - moon[0]))
  );
  const { sign, degree: signDegree } = getZodiacSign(fortuna);

  return {
    id: -1,
    name: 'Fortuna',
    longitude: fortuna,
    latitude: 0,
    distance: 0,
    speed: 0,
    sign,
    signDegree,
    retrograde: false,
    type: 'point',
  };
}
