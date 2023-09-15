import { ErrorRequestHandler } from 'express';
import {
  ConflictError,
  CustomError,
  UnauthorizedError,
  ValidationError,
} from '../errors/customErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // console.error('function', error);

  if (error instanceof UnauthorizedError) {
    return res.status(401).send({ message: error.message });
  } else if (error instanceof ConflictError || error.code === 11000) {
    const message = `'${error.keyValue.email}' is already registered`;
    return res.status(409).send({ message: message });
  } else if (error instanceof ValidationError || error.name === 'ValidationError') {
    return res.status(400).send({ message: error.message });
  }

  const isErrorSafeForClient = error instanceof CustomError;

  let clientErrors;

  if (isErrorSafeForClient) {
    clientErrors = [error];
  } else if (Array.isArray(error)) {
    // Si el error es un array, asume que ya contiene múltiples errores y úsalo
    clientErrors = error;
  } else {
    // Si no es seguro o no es un array, crea un error genérico
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
