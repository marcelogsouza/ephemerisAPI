import { getSwissEph } from '../swisseph/singleton.js';
import { FLAGS, getZodiacSign } from '../swisseph/constants.js';
import type { FixedStarPosition } from '../swisseph/types.js';

// The swisseph-wasm fixstar functions read from freed memory.
// We call the WASM module directly with proper .slice() before free.

export async function getFixedStarPosition(
  starName: string,
  year: number, month: number, day: number, hour: number,
): Promise<FixedStarPosition> {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const mod = (swe as any).SweModule;

  const resultPtr = mod._malloc(6 * 8);
  const starBuffer = mod._malloc(256);
  mod.stringToUTF8(starName, starBuffer, 256);
  const serrPtr = mod._malloc(256);

  const retFlag = mod.ccall(
    'swe_fixstar_ut', 'number',
    ['pointer', 'number', 'number', 'pointer', 'pointer'],
    [starBuffer, jd, FLAGS.SWIEPH, resultPtr, serrPtr],
  );

  if (retFlag < 0) {
    const err = mod.UTF8ToString(serrPtr);
    mod._free(resultPtr);
    mod._free(starBuffer);
    mod._free(serrPtr);
    throw new Error(`Fixed star "${starName}" not found: ${err}`);
  }

  const results = new Float64Array(mod.HEAPF64.buffer, resultPtr, 6).slice();
  mod._free(resultPtr);
  mod._free(starBuffer);
  mod._free(serrPtr);

  // Get magnitude
  const magBuffer = mod._malloc(8);
  const starBuffer2 = mod._malloc(256);
  mod.stringToUTF8(starName, starBuffer2, 256);
  const serrPtr2 = mod._malloc(256);
  const magRetFlag = mod.ccall(
    'swe_fixstar_mag', 'number',
    ['pointer', 'pointer', 'pointer'],
    [starBuffer2, magBuffer, serrPtr2],
  );
  const magnitude = magRetFlag < 0 ? null : mod.HEAPF64[magBuffer >> 3];
  mod._free(magBuffer);
  mod._free(starBuffer2);
  mod._free(serrPtr2);

  const { sign, degree: signDegree } = getZodiacSign(results[0]);

  return {
    name: starName,
    longitude: results[0],
    latitude: results[1],
    distance: results[2],
    speed: results[3],
    magnitude,
    sign,
    signDegree,
  };
}
