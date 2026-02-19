import type SwissEphType from 'swisseph-wasm';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { join, dirname } from 'path';

let instance: SwissEphType | null = null;
let initPromise: Promise<SwissEphType> | null = null;

async function loadSwissEph(): Promise<new () => SwissEphType> {
  // Resolve the actual file path since the package exports map doesn't expose subpaths
  const require = createRequire(import.meta.url);
  const pkgPath = dirname(require.resolve('swisseph-wasm/package.json'));
  const modulePath = join(pkgPath, 'src', 'swisseph.js');
  const mod = await import(pathToFileURL(modulePath).href);
  return mod.default;
}

export async function getSwissEph(): Promise<SwissEphType> {
  if (instance) return instance;
  if (!initPromise) {
    initPromise = (async () => {
      const SwissEph = await loadSwissEph();
      const swe = new SwissEph();
      await swe.initSwissEph();
      instance = swe;
      return swe;
    })();
  }
  return initPromise;
}
