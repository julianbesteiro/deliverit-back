/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { JsonWebTokenError } from 'jsonwebtoken';
import { validateToken } from '../utils/tokens';
import { RequestExpress } from '../interfaces/IRequestExpress';

const isAuth = (req: Request | RequestExpress, res: Response, next: NextFunction) => {
  // token looks like 'Bearer vnjaknvijdaknvikbnvreiudfnvriengviewjkdsbnvierj'
  try {
    const authHeader = req.headers['authorization'];
    console.log('THIS IS AUTH HEADER', req.headers);

    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const token: string | undefined = authHeader.split(' ')[1];

    if (!token) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const payload = validateToken(token);

    if (!payload || typeof payload === 'string') return res.sendStatus(httpStatus.UNAUTHORIZED);

    (req as RequestExpress).user = payload.user;

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    next(err);
  }
};

export default isAuth;
