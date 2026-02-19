import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/sidereal.service.js';

const router = Router();

const defaultPlanets = 'sun,moon,mercury,venus,mars,jupiter,saturn,uranus,neptune,pluto';

/**
 * @openapi
 * /api/v1/sidereal/positions:
 *   get:
 *     tags: [Sidereal]
 *     summary: Get sidereal planetary positions
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
 *       - in: query
 *         name: ayanamsa
 *         schema: { type: string, default: lahiri }
 *         description: Ayanamsa system (lahiri, fagan_bradley, krishnamurti, raman, etc.)
 *     responses:
 *       200:
 *         description: Array of sidereal planet positions
 */
router.get('/positions', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  planets: z.string().default(defaultPlanets),
  ayanamsa: z.string().default('lahiri'),
})), async (req, res, next) => {
  try {
    const { year, month, day, hour, planets, ayanamsa } = req.query as any;
    const planetList = planets.split(',').map((s: string) => s.trim());
    res.json(await svc.getSiderealPositions(year, month, day, hour, planetList, ayanamsa));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/sidereal/ayanamsa:
 *   get:
 *     tags: [Sidereal]
 *     summary: Get ayanamsa value for a date
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
 *         name: ayanamsa
 *         schema: { type: string, default: lahiri }
 *     responses:
 *       200:
 *         description: Ayanamsa value in degrees
 */
router.get('/ayanamsa', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  ayanamsa: z.string().default('lahiri'),
})), async (req, res, next) => {
  try {
    const { year, month, day, hour, ayanamsa } = req.query as any;
    res.json(await svc.getAyanamsaValue(year, month, day, hour, ayanamsa));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/sidereal/systems:
 *   get:
 *     tags: [Sidereal]
 *     summary: List available ayanamsa systems
 *     responses:
 *       200:
 *         description: Map of ayanamsa names to mode IDs
 */
router.get('/systems', (_req, res) => {
  res.json(svc.getSiderealSystems());
});

export default router;
