import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/aspects.service.js';

const router = Router();

const defaultPlanets = 'sun,moon,mercury,venus,mars,jupiter,saturn,uranus,neptune,pluto';

/**
 * @openapi
 * /api/v1/aspects/calculate:
 *   get:
 *     tags: [Aspects]
 *     summary: Calculate aspects between planets
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
 *         description: Comma-separated planet names
 *       - in: query
 *         name: aspects
 *         schema: { type: string }
 *         description: "Comma-separated aspect types: conjunction,opposition,trine,square,sextile,quincunx"
 *     responses:
 *       200:
 *         description: Array of aspects found
 */
router.get('/calculate', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  planets: z.string().default(defaultPlanets),
  aspects: z.string().optional(),
})), async (req, res, next) => {
  try {
    const { year, month, day, hour, planets, aspects } = req.query as any;
    const planetList = planets.split(',').map((s: string) => s.trim());
    const aspectList = aspects ? aspects.split(',').map((s: string) => s.trim()) : undefined;
    res.json(await svc.calculateAspects(year, month, day, hour, planetList, aspectList));
  } catch (e) { next(e); }
});

export default router;
