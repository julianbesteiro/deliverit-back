import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JsonWebTokenError } from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';

interface CustomHeaders extends IncomingHttpHeaders {
  authorization?: string;
}

interface RequestExpressExtended extends Request {
  headers: CustomHeaders;
  user: {
    id: string;
    lastName: string;
    email: string;
    role: string;
    enabled: boolean;
    lastSeenAt: Date;
    urlImage: string;
  };
}

const isAdmin = (req: Request | RequestExpressExtended, res: Response, next: NextFunction) => {
  try {
    if (
      (req as RequestExpressExtended).user &&
      (req as RequestExpressExtended).user.role === 'admin'
    ) {
      next();
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    next(err);
  }
};

export default isAdmin;
