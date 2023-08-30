import { NextFunction, Request, Response } from 'express';
import { ConflictError, ValidationError } from '../errors/customErrors';
import { ErrorWithCode } from '@/interfaces/IError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
  console.error('Central Error Handler:', err);

  if (err instanceof ConflictError || err.code === 11000) {
    res.status(409).send({ message: err.message });
  } else if (err instanceof ValidationError || err.name === 'ValidationError') {
    res.status(400).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Unexpected error occurred' });
  }
};

export default errorHandler;
