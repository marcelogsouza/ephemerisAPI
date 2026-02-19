import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ephemeris API',
      version: '1.0.0',
      description: 'REST API wrapping the Swiss Ephemeris via swisseph-wasm WebAssembly. Provides astronomical and astrological calculations including planetary positions, house cusps, aspects, eclipses, fixed stars, and more.',
      license: {
        name: 'AGPL-3.0-or-later',
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
      },
      contact: {
        url: 'https://github.com/marcelogsouza/ephemerisAPI',
      },
    },
    servers: [
      { url: '/', description: 'Current server' },
    ],
    tags: [
      { name: 'Planets', description: 'Planetary position calculations' },
      { name: 'Houses', description: 'House cusp calculations' },
      { name: 'Aspects', description: 'Aspect calculations between planets' },
      { name: 'Chart', description: 'Complete natal chart calculations' },
      { name: 'Sidereal', description: 'Sidereal position and ayanamsa calculations' },
      { name: 'DateTime', description: 'Date/time conversions and Julian Day calculations' },
      { name: 'Fixed Stars', description: 'Fixed star positions and magnitudes' },
      { name: 'Rise/Set', description: 'Rise, set, and meridian transit calculations' },
      { name: 'Coordinates', description: 'Coordinate system transformations' },
      { name: 'Degrees', description: 'Degree normalization and splitting' },
      { name: 'Eclipses', description: 'Solar and lunar eclipse calculations' },
      { name: 'Meta', description: 'API health and version information' },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
