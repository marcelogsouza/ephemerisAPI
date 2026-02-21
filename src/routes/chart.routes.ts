import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import * as svc from '../services/chart.service.js';

const router = Router();

const natalChartSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59).default(0),
  second: z.number().min(0).max(60).default(0),
  timezone: z.number().min(-12).max(14),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  houseSystem: z.string().length(1).default('P'),
  zodiacType: z.enum(['tropical', 'sidereal']).default('tropical'),
  ayanamsa: z.string().optional(),
  aspects: z.array(z.string()).optional(),
  aspectOrbs: z.record(z.string(), z.number()).optional(),
  planets: z.array(z.string()).optional(),
});

/**
 * @openapi
 * /api/v1/chart/natal:
 *   post:
 *     tags: [Chart]
 *     summary: Calculate a complete natal chart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [year, month, day, hour, timezone, latitude, longitude]
 *             properties:
 *               year: { type: integer }
 *               month: { type: integer }
 *               day: { type: integer }
 *               hour: { type: integer }
 *               minute: { type: integer, default: 0 }
 *               second: { type: number, default: 0 }
 *               timezone: { type: number, description: "UTC offset in hours" }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               houseSystem: { type: string, default: P }
 *               zodiacType: { type: string, enum: [tropical, sidereal], default: tropical }
 *               ayanamsa: { type: string }
 *               aspects: { type: array, items: { type: string } }
 *               aspectOrbs: { type: object, additionalProperties: { type: number } }
 *               planets: { type: array, items: { type: string }, description: "Planet keys to include (supports fortuna, lilith, quiron aliases)" }
 *     responses:
 *       200:
 *         description: Complete natal chart with planets, houses, and aspects
 */
router.post('/natal', validateBody(natalChartSchema), async (req, res, next) => {
  try {
    res.json(await svc.calculateNatalChart(req.body));
  } catch (e) { next(e); }
});

export default router;
