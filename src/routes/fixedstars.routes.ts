import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/fixedstars.service.js';

const router = Router();

/**
 * @openapi
 * /api/v1/fixedstars/position:
 *   get:
 *     tags: [Fixed Stars]
 *     summary: Get fixed star position
 *     parameters:
 *       - in: query
 *         name: star
 *         required: true
 *         schema: { type: string }
 *         description: Star name (e.g. Sirius, Regulus, Aldebaran)
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
 *     responses:
 *       200:
 *         description: Star position and magnitude
 */
router.get('/position', validateQuery(z.object({
  star: z.string().min(1),
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
})), async (req, res, next) => {
  try {
    const { star, year, month, day, hour } = req.query as any;
    res.json(await svc.getFixedStarPosition(star, year, month, day, hour));
  } catch (e) { next(e); }
});

export default router;
