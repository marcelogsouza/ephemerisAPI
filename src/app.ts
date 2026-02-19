import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/config.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Ephemeris API Documentation',
}));

app.get('/api/v1/openapi.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/v1', routes);

app.get('/', (_req, res) => {
  res.json({
    name: 'Ephemeris API',
    version: '1.0.0',
    docs: '/docs',
    health: '/api/v1/health',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Ephemeris API running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/docs`);
  });
}

export default app;
