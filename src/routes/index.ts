import { Router } from 'express';
import datetimeRoutes from './datetime.routes.js';
import degreesRoutes from './degrees.routes.js';
import planetsRoutes from './planets.routes.js';
import housesRoutes from './houses.routes.js';
import aspectsRoutes from './aspects.routes.js';
import siderealRoutes from './sidereal.routes.js';
import fixedstarsRoutes from './fixedstars.routes.js';
import risesetRoutes from './riseset.routes.js';
import coordinatesRoutes from './coordinates.routes.js';
import eclipsesRoutes from './eclipses.routes.js';
import chartRoutes from './chart.routes.js';
import { getSwissEph } from '../swisseph/singleton.js';

const router = Router();

router.use('/datetime', datetimeRoutes);
router.use('/degrees', degreesRoutes);
router.use('/planets', planetsRoutes);
router.use('/houses', housesRoutes);
router.use('/aspects', aspectsRoutes);
router.use('/sidereal', siderealRoutes);
router.use('/fixedstars', fixedstarsRoutes);
router.use('/riseset', risesetRoutes);
router.use('/coordinates', coordinatesRoutes);
router.use('/eclipses', eclipsesRoutes);
router.use('/chart', chartRoutes);

/**
 * @openapi
 * /api/v1/version:
 *   get:
 *     tags: [Meta]
 *     summary: Get Swiss Ephemeris version
 *     responses:
 *       200:
 *         description: Version information
 */
router.get('/version', async (_req, res, next) => {
  try {
    const swe = await getSwissEph();
    res.json({ version: swe.version(), api: '1.0.0' });
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     tags: [Meta]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', async (_req, res, next) => {
  try {
    const swe = await getSwissEph();
    swe.julday(2000, 1, 1, 12);
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (e) { next(e); }
});

export default router;
