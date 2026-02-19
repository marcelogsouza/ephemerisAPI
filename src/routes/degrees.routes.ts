import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/degrees.service.js';

const router = Router();

/**
 * @openapi
 * /api/v1/degrees/normalize:
 *   get:
 *     tags: [Degrees]
 *     summary: Normalize degrees to 0-360 range
 *     parameters:
 *       - in: query
 *         name: degree
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Normalized degree
 */
router.get('/normalize', validateQuery(z.object({
  degree: z.coerce.number(),
})), async (req, res, next) => {
  try {
    const { degree } = req.query as any;
    res.json(await svc.normalizeDegree(degree));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/degrees/split:
 *   get:
 *     tags: [Degrees]
 *     summary: Split degrees into D M S components
 *     parameters:
 *       - in: query
 *         name: degree
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: roundFlag
 *         schema: { type: integer, default: 1 }
 *         description: "1=round sec, 2=round min, 4=round deg, 8=zodiacal, 16=keep sign"
 *     responses:
 *       200:
 *         description: Degree components
 */
router.get('/split', validateQuery(z.object({
  degree: z.coerce.number(),
  roundFlag: z.coerce.number().int().default(1),
})), async (req, res, next) => {
  try {
    const { degree, roundFlag } = req.query as any;
    res.json(await svc.splitDegree(degree, roundFlag));
  } catch (e) { next(e); }
});

export default router;
