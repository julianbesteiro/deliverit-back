import { NextFunction, Request, Response } from 'express';
import { RequestExpress } from './IRequestExpress';

export interface CustomError {
  name?: string;
  code?: string | number;
  message: string;
}

export interface ErrorWithCode extends Error {
  code?: number;
}

export type MiddlewareFunction = (
  req: RequestExpress | Request,
  res: Response,
  _next: NextFunction,
) => void;
