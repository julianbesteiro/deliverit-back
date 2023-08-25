import { NextFunction, Request, Response } from 'express';
import { MiddlewareFunction } from '@/interfaces/IError';

export const asyncHandler =
  (fn: MiddlewareFunction) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
