import { getSwissEph } from '../swisseph/singleton.js';
import { PLANETS, ASPECTS, DEFAULT_ORBS, FLAGS } from '../swisseph/constants.js';
import type { AspectData } from '../swisseph/types.js';

const ASPECT_EPSILON = 0.01; // tolerance to avoid losing borderline aspects due to rounding
const normalizeLongitude = (value: number): number => ((value % 360) + 360) % 360;

export async function calculateAspects(
  year: number, month: number, day: number, hour: number,
  planetKeys: string[],
  aspectKeys: string[] = Object.keys(ASPECTS),
  customOrbs?: Record<string, number>,
): Promise<AspectData[]> {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const flags = FLAGS.SWIEPH | FLAGS.SPEED;

  const positions: { key: string; name: string; longitude: number; speed: number }[] = [];
  for (const key of planetKeys) {
    const id = PLANETS[key.toLowerCase()];
    if (id === undefined) continue;
    const pos = swe.calc_ut(jd, id, flags);
    positions.push({
      key: key.toLowerCase(),
      name: swe.get_planet_name(id),
      longitude: normalizeLongitude(pos[0]),
      speed: pos[3],
    });
  }

  const results: AspectData[] = [];
  const orbs = { ...DEFAULT_ORBS, ...customOrbs };

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      let angle = Math.abs(p1.longitude - p2.longitude);
      if (angle > 180) angle = 360 - angle;

      for (const aspectKey of aspectKeys) {
        const exactAngle = ASPECTS[aspectKey.toLowerCase()];
        if (exactAngle === undefined) continue;
        const maxOrb = orbs[aspectKey.toLowerCase()] ?? 8;
        const orb = Math.abs(angle - exactAngle);

        if (orb <= maxOrb + ASPECT_EPSILON) {
          const speedDiff = p1.speed - p2.speed;
          const applying = exactAngle === 0
            ? Math.abs(p1.longitude - p2.longitude) > 180
              ? speedDiff > 0
              : speedDiff < 0
            : angle < exactAngle ? speedDiff < 0 : speedDiff > 0;

          results.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: aspectKey.toLowerCase(),
            exactAngle,
            actualAngle: angle,
            orb: Math.round(orb * 1000) / 1000,
            applying,
          });
        }
      }
    }
  }

  return results;
}
