import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/houses.service.js';

const router = Router();

/**
 * @openapi
 * /api/v1/houses/cusps:
 *   get:
 *     tags: [Houses]
 *     summary: Calculate house cusps and angles
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: day
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: hour
 *         schema: { type: number, default: 0 }
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: system
 *         schema: { type: string, default: P }
 *         description: "House system: P=Placidus, K=Koch, O=Porphyrius, R=Regiomontanus, C=Campanus, E=Equal, W=Whole Sign, B=Alcabitius, M=Morinus, T=Topocentric"
 *     responses:
 *       200:
 *         description: House cusps and angles
 */
router.get('/cusps', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  system: z.string().length(1).default('P'),
})), async (req, res, next) => {
  try {
    const { year, month, day, hour, latitude, longitude, system } = req.query as any;
    res.json(await svc.getHouseCusps(year, month, day, hour, latitude, longitude, system));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/houses/systems:
 *   get:
 *     tags: [Houses]
 *     summary: List available house systems
 *     responses:
 *       200:
 *         description: Map of house system codes to names
 */
router.get('/systems', (_req, res) => {
  res.json(svc.getHouseSystems());
});

/**
 * @openapi
 * /api/v1/houses/position:
 *   get:
 *     tags: [Houses]
 *     summary: Get house position for a planet
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: day
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: hour
 *         schema: { type: number, default: 0 }
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: planetLongitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: planetLatitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: system
 *         schema: { type: string, default: P }
 *     responses:
 *       200:
 *         description: House position number
 */
router.get('/position', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  planetLongitude: z.coerce.number(),
  planetLatitude: z.coerce.number(),
  system: z.string().length(1).default('P'),
})), async (req, res, next) => {
  try {
    const q = req.query as any;
    const pos = await svc.getHousePosition(
      q.year, q.month, q.day, q.hour,
      q.latitude, q.longitude,
      q.planetLongitude, q.planetLatitude,
      q.system,
    );
    res.json({ housePosition: pos });
  } catch (e) { next(e); }
});

export default router;
