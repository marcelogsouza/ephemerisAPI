import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/planets.service.js';

const router = Router();

const defaultPlanets = 'sun,moon,mercury,venus,mars,jupiter,saturn,uranus,neptune,pluto';

/**
 * @openapi
 * /api/v1/planets/positions:
 *   get:
 *     tags: [Planets]
 *     summary: Get planetary positions
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
 *         name: planets
 *         schema: { type: string }
 *         description: Comma-separated planet names (e.g. sun,moon,mars)
 *       - in: query
 *         name: flags
 *         schema: { type: integer }
 *         description: Swiss Ephemeris calculation flags
 *     responses:
 *       200:
 *         description: Array of planet positions
 */
router.get('/positions', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  planets: z.string().default(defaultPlanets),
  flags: z.coerce.number().int().optional(),
})), async (req, res, next) => {
  try {
    const { year, month, day, hour, planets, flags } = req.query as any;
    const planetList = planets.split(',').map((s: string) => s.trim());
    res.json(await svc.getPlanetPositions(year, month, day, hour, planetList, flags));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/planets/names:
 *   get:
 *     tags: [Planets]
 *     summary: Get available planet names and IDs
 *     responses:
 *       200:
 *         description: Map of planet names to IDs
 */
router.get('/names', async (_req, res, next) => {
  try {
    res.json(await svc.getPlanetNames());
  } catch (e) { next(e); }
});

export default router;
