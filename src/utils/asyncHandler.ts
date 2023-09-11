import { NextFunction, Request, Response } from 'express';
import { MiddlewareFunction } from '@/interfaces/IError';
import { RequestExpress } from '@/interfaces/IRequestExpress';

export const asyncHandler =
  (fn: MiddlewareFunction) =>
  (req: RequestExpress | Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
