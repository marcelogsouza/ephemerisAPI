import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/eclipses.service.js';

const router = Router();

const dateSchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
});

/**
 * @openapi
 * /api/v1/eclipses/solar/next:
 *   get:
 *     tags: [Eclipses]
 *     summary: Find next solar eclipse after a given date
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
 *     responses:
 *       200:
 *         description: Next solar eclipse information
 */
router.get('/solar/next', validateQuery(dateSchema), async (req, res, next) => {
  try {
    const { year, month, day } = req.query as any;
    res.json(await svc.getNextSolarEclipse(year, month, day));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/eclipses/lunar/next:
 *   get:
 *     tags: [Eclipses]
 *     summary: Find next lunar eclipse after a given date
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
 *     responses:
 *       200:
 *         description: Next lunar eclipse information
 */
router.get('/lunar/next', validateQuery(dateSchema), async (req, res, next) => {
  try {
    const { year, month, day } = req.query as any;
    res.json(await svc.getNextLunarEclipse(year, month, day));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/eclipses/solar/local:
 *   get:
 *     tags: [Eclipses]
 *     summary: Find next solar eclipse visible from a location
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
 *         name: longitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: altitude
 *         schema: { type: number, default: 0 }
 *     responses:
 *       200:
 *         description: Next local solar eclipse information
 */
router.get('/solar/local', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  altitude: z.coerce.number().default(0),
})), async (req, res, next) => {
  try {
    const { year, month, day, longitude, latitude, altitude } = req.query as any;
    res.json(await svc.getSolarEclipseLocal(year, month, day, longitude, latitude, altitude));
  } catch (e) { next(e); }
});

export default router;
