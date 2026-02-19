import { getSwissEph } from '../swisseph/singleton.js';
import { FLAGS } from '../swisseph/constants.js';

// The swisseph-wasm library has incorrect parameter mapping for eclipse functions.
// We call the WASM module directly with the correct C API signatures.

async function callSolEclipseWhenGlob(jdStart: number, flags: number, eclipseType: number, backward: number) {
  const swe = await getSwissEph();
  const mod = (swe as any).SweModule;
  const resultPtr = mod._malloc(10 * 8);
  const serrPtr = mod._malloc(256);
  const retFlag = mod.ccall(
    'swe_sol_eclipse_when_glob', 'number',
    ['number', 'number', 'number', 'pointer', 'number', 'pointer'],
    [jdStart, flags, eclipseType, resultPtr, backward, serrPtr],
  );
  const results = new Float64Array(mod.HEAPF64.buffer, resultPtr, 10).slice();
  mod._free(resultPtr);
  mod._free(serrPtr);
  if (retFlag < 0) throw new Error('Could not find solar eclipse');
  return { retFlag, results };
}

async function callLunEclipseWhen(jdStart: number, flags: number, eclipseType: number, backward: number) {
  const swe = await getSwissEph();
  const mod = (swe as any).SweModule;
  const resultPtr = mod._malloc(10 * 8);
  const serrPtr = mod._malloc(256);
  const retFlag = mod.ccall(
    'swe_lun_eclipse_when', 'number',
    ['number', 'number', 'number', 'pointer', 'number', 'pointer'],
    [jdStart, flags, eclipseType, resultPtr, backward, serrPtr],
  );
  const results = new Float64Array(mod.HEAPF64.buffer, resultPtr, 10).slice();
  mod._free(resultPtr);
  mod._free(serrPtr);
  if (retFlag < 0) throw new Error('Could not find lunar eclipse');
  return { retFlag, results };
}

async function callSolEclipseWhenLoc(
  jdStart: number, flags: number,
  geoLon: number, geoLat: number, altitude: number, backward: number,
) {
  const swe = await getSwissEph();
  const mod = (swe as any).SweModule;
  const geoposPtr = mod._malloc(3 * 8);
  mod.HEAPF64[geoposPtr >> 3] = geoLon;
  mod.HEAPF64[(geoposPtr >> 3) + 1] = geoLat;
  mod.HEAPF64[(geoposPtr >> 3) + 2] = altitude;
  const tretPtr = mod._malloc(10 * 8);
  const attrPtr = mod._malloc(20 * 8);
  const serrPtr = mod._malloc(256);
  const retFlag = mod.ccall(
    'swe_sol_eclipse_when_loc', 'number',
    ['number', 'number', 'pointer', 'pointer', 'pointer', 'number', 'pointer'],
    [jdStart, flags, geoposPtr, tretPtr, attrPtr, backward, serrPtr],
  );
  const tret = new Float64Array(mod.HEAPF64.buffer, tretPtr, 10).slice();
  mod._free(geoposPtr);
  mod._free(tretPtr);
  mod._free(attrPtr);
  mod._free(serrPtr);
  if (retFlag < 0) throw new Error('Could not find local solar eclipse');
  return { retFlag, tret };
}

function eclipseTypeName(flags: number): string {
  if (flags & 4) return 'total';
  if (flags & 8) return 'annular';
  if (flags & 32) return 'annular-total';
  if (flags & 16) return 'partial';
  if (flags & 64) return 'penumbral';
  return 'unknown';
}

export async function getNextSolarEclipse(year: number, month: number, day: number) {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, 0);
  const { retFlag, results } = await callSolEclipseWhenGlob(jd, FLAGS.SWIEPH, 63, 0);
  const maxJd = results[0];
  const date = swe.revjul(maxJd, swe.SE_GREG_CAL);
  return {
    type: eclipseTypeName(retFlag),
    julianDay: maxJd,
    date,
  };
}

export async function getNextLunarEclipse(year: number, month: number, day: number) {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, 0);
  const { retFlag, results } = await callLunEclipseWhen(jd, FLAGS.SWIEPH, 84, 0);
  const maxJd = results[0];
  const date = swe.revjul(maxJd, swe.SE_GREG_CAL);
  return {
    type: eclipseTypeName(retFlag),
    julianDay: maxJd,
    date,
  };
}

export async function getSolarEclipseLocal(
  year: number, month: number, day: number,
  longitude: number, latitude: number, altitude: number = 0,
) {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, 0);
  const { retFlag, tret } = await callSolEclipseWhenLoc(jd, FLAGS.SWIEPH, longitude, latitude, altitude, 0);
  const maxJd = tret[0];
  const date = swe.revjul(maxJd, swe.SE_GREG_CAL);
  return {
    type: eclipseTypeName(retFlag),
    julianDay: maxJd,
    date,
    location: { longitude, latitude, altitude },
  };
}
