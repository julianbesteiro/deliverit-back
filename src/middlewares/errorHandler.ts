import { ErrorRequestHandler } from 'express';
import {
  ConflictError,
  CustomError,
  S3UploadError,
  UnauthorizedError,
  ValidationError,
} from '../errors/customErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('debug:', error);

  if (error instanceof UnauthorizedError) {
    return res.status(401).send({ message: error.message });
  } else if (error instanceof ConflictError || error.code === 11000) {
    const message = `'${error.keyValue.email}' is already registered`;
    return res.status(409).send({ message: message });
  } else if (error instanceof ValidationError || error.name === 'ValidationError') {
    return res.status(400).send({ message: error.message });
  } else if (error instanceof S3UploadError) {
    return res.status(500).send({ message: error.message });
  }

  const isErrorSafeForClient = error instanceof CustomError;

  let clientErrors;

  if (isErrorSafeForClient) {
    clientErrors = [error];
  } else if (Array.isArray(error)) {
    clientErrors = error;
  } else {
    clientErrors = [
      {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {},
      },
    ];
  }

  const clientErrorResponses = clientErrors.map((error) => ({
    message: error.message,
    code: error.code,
    status: error.status,
    data: error.data,
  }));

  // Si solo hay un error y no es seguro, envía solo el objeto de error en lugar de un array
  if (clientErrorResponses.length === 1) {
    res.status(clientErrorResponses[0].status).send({ error: clientErrorResponses[0] });
  } else {
    res.status(clientErrorResponses[0].status).send({ errors: clientErrorResponses });
  }
};
