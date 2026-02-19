import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/riseset.service.js';

const router = Router();

/**
 * @openapi
 * /api/v1/riseset/times:
 *   get:
 *     tags: [Rise/Set]
 *     summary: Calculate rise, set, or meridian transit time
 *     parameters:
 *       - in: query
 *         name: planet
 *         required: true
 *         schema: { type: string }
 *         description: Planet name (e.g. sun, moon, mars)
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
 *         name: event
 *         schema: { type: string, enum: [rise, set, meridian_transit], default: rise }
 *     responses:
 *       200:
 *         description: Event time as Julian Day and UTC
 */
router.get('/times', validateQuery(z.object({
  planet: z.string().min(1),
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  event: z.enum(['rise', 'set', 'meridian_transit']).default('rise'),
})), async (req, res, next) => {
  try {
    const { planet, year, month, day, hour, latitude, longitude, event } = req.query as any;
    res.json(await svc.getRiseSetTimes(planet, year, month, day, hour, latitude, longitude, event));
  } catch (e) { next(e); }
});

export default router;
