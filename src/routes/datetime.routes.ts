import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/datetime.service.js';

const router = Router();

const dateSchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
});

/**
 * @openapi
 * /api/v1/datetime/julianday:
 *   get:
 *     tags: [DateTime]
 *     summary: Convert date to Julian Day
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
 *     responses:
 *       200:
 *         description: Julian Day value
 */
router.get('/julianday', validateQuery(dateSchema), async (req, res, next) => {
  try {
    const { year, month, day, hour } = req.query as any;
    res.json(await svc.getJulianDay(year, month, day, hour));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/datetime/calendar:
 *   get:
 *     tags: [DateTime]
 *     summary: Convert Julian Day to calendar date
 *     parameters:
 *       - in: query
 *         name: julianDay
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: calendar
 *         schema: { type: string, enum: [gregorian, julian], default: gregorian }
 *     responses:
 *       200:
 *         description: Calendar date
 */
router.get('/calendar', validateQuery(z.object({
  julianDay: z.coerce.number(),
  calendar: z.enum(['gregorian', 'julian']).default('gregorian'),
})), async (req, res, next) => {
  try {
    const { julianDay, calendar } = req.query as any;
    res.json(await svc.getCalendarDate(julianDay, calendar));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/datetime/siderealtime:
 *   get:
 *     tags: [DateTime]
 *     summary: Calculate sidereal time
 *     parameters:
 *       - in: query
 *         name: julianDay
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Sidereal time in hours
 */
router.get('/siderealtime', validateQuery(z.object({
  julianDay: z.coerce.number(),
})), async (req, res, next) => {
  try {
    const { julianDay } = req.query as any;
    res.json(await svc.getSiderealTime(julianDay));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/datetime/deltat:
 *   get:
 *     tags: [DateTime]
 *     summary: Calculate Delta T
 *     parameters:
 *       - in: query
 *         name: julianDay
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Delta T value
 */
router.get('/deltat', validateQuery(z.object({
  julianDay: z.coerce.number(),
})), async (req, res, next) => {
  try {
    const { julianDay } = req.query as any;
    res.json(await svc.getDeltaT(julianDay));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/datetime/utc-to-jd:
 *   get:
 *     tags: [DateTime]
 *     summary: Convert UTC to Julian Day
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
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: minute
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: second
 *         schema: { type: number, default: 0 }
 *     responses:
 *       200:
 *         description: Julian Day ET and UT
 */
router.get('/utc-to-jd', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().int().min(0).max(23).default(0),
  minute: z.coerce.number().int().min(0).max(59).default(0),
  second: z.coerce.number().min(0).max(60).default(0),
})), async (req, res, next) => {
  try {
    const { year, month, day, hour, minute, second } = req.query as any;
    res.json(await svc.utcToJd(year, month, day, hour, minute, second));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/datetime/dayofweek:
 *   get:
 *     tags: [DateTime]
 *     summary: Get day of week
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
 *     responses:
 *       200:
 *         description: Day of week (0=Monday, 6=Sunday)
 */
router.get('/dayofweek', validateQuery(dateSchema), async (req, res, next) => {
  try {
    const { year, month, day, hour } = req.query as any;
    res.json(await svc.getDayOfWeek(year, month, day, hour));
  } catch (e) { next(e); }
});

export default router;
