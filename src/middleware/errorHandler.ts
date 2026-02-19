import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err);

  if (err.message?.includes('swe_calc') || err.message?.includes('SwissEph')) {
    res.status(422).json({
      error: {
        code: 'CALCULATION_ERROR',
        message: err.message,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
    },
  });
}
