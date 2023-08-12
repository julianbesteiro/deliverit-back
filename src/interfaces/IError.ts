import { NextFunction, Request, Response } from 'express';

export interface CustomError {
  name?: string;
  code?: string | number;
  message: string;
}

export type MiddlewareFunction = (req: Request, res: Response, _next: NextFunction) => void;
