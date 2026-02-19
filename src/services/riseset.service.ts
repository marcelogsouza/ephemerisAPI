import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, FLAGS } from '../swisseph/constants.js';

// The swisseph-wasm library has incorrect parameter mapping for rise_trans.
// C signature: swe_rise_trans(double tjd_ut, int32 ipl, char *starname, int32 epheflag,
//              int32 rsmi, double *geopos, double atpress, double attemp, double *tret, char *serr)

export async function getRiseSetTimes(
  planetKey: string,
  year: number, month: number, day: number, hour: number,
  latitude: number, longitude: number,
  event: 'rise' | 'set' | 'meridian_transit' = 'rise',
) {
  const swe = await getSwissEph();
  const planetId = PLANETS[planetKey.toLowerCase()];
  if (planetId === undefined) {
    throw new Error(`Unknown planet: ${planetKey}`);
  }

  const jd = swe.julday(year, month, day, hour);

  let rsmi: number;
  switch (event) {
    case 'rise': rsmi = 1; break;
    case 'set': rsmi = 2; break;
    case 'meridian_transit': rsmi = 4; break;
    default: rsmi = 1;
  }

  const mod = (swe as any).SweModule;
  const geoposPtr = mod._malloc(3 * 8);
  mod.HEAPF64[geoposPtr >> 3] = longitude;
  mod.HEAPF64[(geoposPtr >> 3) + 1] = latitude;
  mod.HEAPF64[(geoposPtr >> 3) + 2] = 0;
  const tretPtr = mod._malloc(8);
  const serrPtr = mod._malloc(256);

  const retFlag = mod.ccall(
    'swe_rise_trans', 'number',
    ['number', 'number', 'string', 'number', 'number', 'pointer', 'number', 'number', 'pointer', 'pointer'],
    [jd, planetId, '', FLAGS.SWIEPH, rsmi, geoposPtr, 0, 0, tretPtr, serrPtr],
  );

  const tret = mod.HEAPF64[tretPtr >> 3];
  mod._free(geoposPtr);
  mod._free(tretPtr);
  mod._free(serrPtr);

  if (retFlag < 0) {
    throw new Error(`Could not calculate ${event} for ${planetKey}`);
  }

  const date = swe.revjul(tret, swe.SE_GREG_CAL);

  return {
    event,
    planet: swe.get_planet_name(planetId),
    julianDay: tret,
    utc: date,
  };
}
