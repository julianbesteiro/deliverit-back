export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class DatabaseConnectionError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}
