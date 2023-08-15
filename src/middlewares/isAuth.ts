/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { JsonWebTokenError } from 'jsonwebtoken';
import { validateToken } from '../utils/tokens';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // token looks like 'Bearer vnjaknvijdaknvikbnvreiudfnvriengviewjkdsbnvierj'
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const token: string | undefined = authHeader.split(' ')[1];

    if (!token) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const payload = validateToken(token);

    if (!payload || typeof payload === 'string') return res.sendStatus(httpStatus.UNAUTHORIZED);

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    next(err);
  }
};

export default isAuth;
