# Ephemeris API

REST API wrapping the Swiss Ephemeris via `swisseph-wasm` (WebAssembly). It provides astronomical and astrological calculations including planetary positions, house cusps, aspects, eclipses, fixed stars, rise/set times, coordinate conversions, and complete natal charts.

This project uses the open-source `swisseph-wasm` package: [prolaxu/swisseph-wasm](https://github.com/prolaxu/swisseph-wasm).

## Features
- Planetary positions (tropical and sidereal)
- House cusps and angles (multiple house systems)
- Aspect calculations with orbs
- Fixed star positions and magnitudes
- Rise, set, and meridian transit times
- Solar and lunar eclipse queries
- Coordinate conversions (ecliptic/equatorial/horizontal)
- Julian Day and calendar utilities
- OpenAPI/Swagger docs

## Tech Stack
- Node.js + TypeScript
- Express
- `swisseph-wasm` (Swiss Ephemeris)
- Zod for validation
- Swagger/OpenAPI docs

## Quick Start

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run start
```

Server:
- `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/api/v1/openapi.json`

## Public Deployment

The API is available at:
- Base URL: [https://ephemerisapi.vercel.app](https://ephemerisapi.vercel.app)
- Swagger UI: [https://ephemerisapi.vercel.app/docs/](https://ephemerisapi.vercel.app/docs/)
- OpenAPI JSON: [https://ephemerisapi.vercel.app/api/v1/openapi.json](https://ephemerisapi.vercel.app/api/v1/openapi.json)

## Example Requests

Health:

```bash
curl -s "http://localhost:3000/api/v1/health"
```

Planet positions:

```bash
curl -s "http://localhost:3000/api/v1/planets/positions?year=2024&month=1&day=1&hour=0&planets=sun,moon"
```

House cusps:

```bash
curl -s "http://localhost:3000/api/v1/houses/cusps?year=2024&month=1&day=1&hour=0&latitude=-23.55&longitude=-46.63&system=P"
```

Natal chart:

```bash
curl -s -X POST "http://localhost:3000/api/v1/chart/natal" \
  -H "Content-Type: application/json" \
  -d '{"year":1990,"month":5,"day":15,"hour":10,"minute":30,"timezone":-3,"latitude":-23.55,"longitude":-46.63,"houseSystem":"P","zodiacType":"tropical"}'
```

## API Overview

Base path: `/api/v1`

- `GET /health`
- `GET /version`
- `GET /datetime/*` (Julian day, calendar, sidereal time, delta T, UTC to JD, day of week)
- `GET /degrees/*` (normalize, split)
- `GET /planets/*` (positions, names)
- `GET /houses/*` (cusps, systems, position)
- `GET /aspects/calculate`
- `GET /sidereal/*` (positions, ayanamsa, systems)
- `GET /fixedstars/position`
- `GET /riseset/times`
- `GET /coordinates/*` (ecliptic/equatorial/horizontal)
- `GET /eclipses/*` (solar/lunar)
- `POST /chart/natal`

For full details and parameters, see Swagger UI at `/docs`.

## Deployment

This project includes a `vercel.json` that deploys the API as a serverless function using `@vercel/node`.

## License

AGPL-3.0-or-later. This project uses Swiss Ephemeris and must remain public under AGPL terms.
