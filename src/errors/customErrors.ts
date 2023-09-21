/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
type ErrorData = { [key: string]: any };

export class CustomError extends Error {
  constructor(
    public message: string,
    public code: string | number = 'INTERNAL_ERROR',
    public status: number = 500,
    public data: ErrorData = {},
  ) {
    super();
  }
}

export class RouteNotFoundError extends CustomError {
  constructor(originalUrl: string) {
    super(`Route '${originalUrl}' does not exist.`, 'ROUTE_NOT_FOUND', 404);
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(entityName: string) {
    super(`${entityName} not found.`, 'ENTITY_NOT_FOUND', 404);
  }
}

export class BadUserInputError extends CustomError {
  constructor(errorData: ErrorData) {
    super('There were validation errors.', 'BAD_USER_INPUT', 400, errorData);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 'Validation Error', 400);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 'BAD REQUEST ERROR', 400);
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message = 'Authentication token is invalid.') {
    super(message, 'INVALID_TOKEN', 401);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403);
  }
}
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class DatabaseConnectionError extends CustomError {
  constructor(message: string) {
    super(message, 'DATABASE_CONNECTION_ERROR', 500);
  }
}

export class S3UploadError extends CustomError {
  constructor(message: string) {
    super(message, 'S3_UPLOAD_ERROR', 500);
  }
}
