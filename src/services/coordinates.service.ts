import { getSwissEph } from '../swisseph/singleton.js';

export async function eclipticToEquatorial(longitude: number, latitude: number, distance: number, obliquity: number = 23.4393) {
  const swe = await getSwissEph();
  const result = swe.cotrans([longitude, latitude, distance], -obliquity);
  return {
    rightAscension: result[0],
    declination: result[1],
    distance: result[2],
  };
}

export async function equatorialToEcliptic(rightAscension: number, declination: number, distance: number, obliquity: number = 23.4393) {
  const swe = await getSwissEph();
  const result = swe.cotrans([rightAscension, declination, distance], obliquity);
  return {
    longitude: result[0],
    latitude: result[1],
    distance: result[2],
  };
}

export async function toHorizontal(
  year: number, month: number, day: number, hour: number,
  geoLon: number, geoLat: number, altitude: number,
  eclLon: number, eclLat: number,
) {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const result = swe.azalt(jd, 0, [geoLon, geoLat, altitude], 0, 0, [eclLon, eclLat, 1]);
  return {
    azimuth: result.azimuth,
    trueAltitude: result.trueAltitude,
    apparentAltitude: result.apparentAltitude,
  };
}
