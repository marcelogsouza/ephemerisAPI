import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import * as svc from '../services/coordinates.service.js';

const router = Router();

/**
 * @openapi
 * /api/v1/coordinates/ecliptic-to-equatorial:
 *   get:
 *     tags: [Coordinates]
 *     summary: Convert ecliptic to equatorial coordinates
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: distance
 *         schema: { type: number, default: 1 }
 *       - in: query
 *         name: obliquity
 *         schema: { type: number, default: 23.4393 }
 *     responses:
 *       200:
 *         description: Equatorial coordinates (RA, Dec, distance)
 */
router.get('/ecliptic-to-equatorial', validateQuery(z.object({
  longitude: z.coerce.number(),
  latitude: z.coerce.number(),
  distance: z.coerce.number().default(1),
  obliquity: z.coerce.number().default(23.4393),
})), async (req, res, next) => {
  try {
    const { longitude, latitude, distance, obliquity } = req.query as any;
    res.json(await svc.eclipticToEquatorial(longitude, latitude, distance, obliquity));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/coordinates/equatorial-to-ecliptic:
 *   get:
 *     tags: [Coordinates]
 *     summary: Convert equatorial to ecliptic coordinates
 *     parameters:
 *       - in: query
 *         name: rightAscension
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: declination
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: distance
 *         schema: { type: number, default: 1 }
 *       - in: query
 *         name: obliquity
 *         schema: { type: number, default: 23.4393 }
 *     responses:
 *       200:
 *         description: Ecliptic coordinates (longitude, latitude, distance)
 */
router.get('/equatorial-to-ecliptic', validateQuery(z.object({
  rightAscension: z.coerce.number(),
  declination: z.coerce.number(),
  distance: z.coerce.number().default(1),
  obliquity: z.coerce.number().default(23.4393),
})), async (req, res, next) => {
  try {
    const { rightAscension, declination, distance, obliquity } = req.query as any;
    res.json(await svc.equatorialToEcliptic(rightAscension, declination, distance, obliquity));
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/coordinates/horizontal:
 *   get:
 *     tags: [Coordinates]
 *     summary: Convert ecliptic to horizontal (azimuth/altitude) coordinates
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
 *         name: geoLon
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: geoLat
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: altitude
 *         schema: { type: number, default: 0 }
 *       - in: query
 *         name: eclLon
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: eclLat
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Horizontal coordinates (azimuth, altitude)
 */
router.get('/horizontal', validateQuery(z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().min(0).max(24).default(0),
  geoLon: z.coerce.number(),
  geoLat: z.coerce.number(),
  altitude: z.coerce.number().default(0),
  eclLon: z.coerce.number(),
  eclLat: z.coerce.number(),
})), async (req, res, next) => {
  try {
    const q = req.query as any;
    res.json(await svc.toHorizontal(
      q.year, q.month, q.day, q.hour,
      q.geoLon, q.geoLat, q.altitude,
      q.eclLon, q.eclLat,
    ));
  } catch (e) { next(e); }
});

export default router;
