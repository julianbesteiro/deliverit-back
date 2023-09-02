import { ErrorRequestHandler } from 'express';
import { CustomError } from '@/errors/customErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('function', error);

  const isErrorSafeForClient = error instanceof CustomError;

  let clientErrors;

  if (isErrorSafeForClient) {
    // Si el error es seguro para el cliente, conviértelo en un array de errores
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
  if (clientErrorResponses.length === 1 && !isErrorSafeForClient) {
    res.status(clientErrorResponses[0].status).send({ error: clientErrorResponses[0] });
  } else {
    res.status(clientErrorResponses[0].status).send({ errors: clientErrorResponses });
  }
};
