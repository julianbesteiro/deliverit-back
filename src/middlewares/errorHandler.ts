import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  console.error(err);
  res.status(500).send({ message: 'Something went wrong' });
};

export default errorHandler;
