"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.InvalidTokenError = exports.BadRequestError = exports.ValidationError = exports.BadUserInputError = exports.EntityNotFoundError = exports.RouteNotFoundError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, code = 'INTERNAL_ERROR', status = 500, data = {}) {
        super();
        this.message = message;
        this.code = code;
        this.status = status;
        this.data = data;
    }
}
exports.CustomError = CustomError;
class RouteNotFoundError extends CustomError {
    constructor(originalUrl) {
        super(`Route '${originalUrl}' does not exist.`, 'ROUTE_NOT_FOUND', 404);
    }
}
exports.RouteNotFoundError = RouteNotFoundError;
class EntityNotFoundError extends CustomError {
    constructor(entityName) {
        super(`${entityName} not found.`, 'ENTITY_NOT_FOUND', 404);
    }
}
exports.EntityNotFoundError = EntityNotFoundError;
class BadUserInputError extends CustomError {
    constructor(errorData) {
        super('There were validation errors.', 'BAD_USER_INPUT', 400, errorData);
    }
}
exports.BadUserInputError = BadUserInputError;
class ValidationError extends CustomError {
    constructor(message) {
        super(message, 'Validation Error', 400);
    }
}
exports.ValidationError = ValidationError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message, 'BAD REQUEST ERROR', 400);
    }
}
exports.BadRequestError = BadRequestError;
class InvalidTokenError extends CustomError {
    constructor(message = 'Authentication token is invalid.') {
        super(message, 'INVALID_TOKEN', 401);
    }
}
exports.InvalidTokenError = InvalidTokenError;
class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message, 'UNAUTHORIZED', 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    constructor(message) {
        super(message, 'FORBIDDEN', 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message, 'NOT_FOUND', 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends CustomError {
    constructor(message) {
        super(message, 'CONFLICT', 409);
    }
}
exports.ConflictError = ConflictError;
class DatabaseConnectionError extends CustomError {
    constructor(message) {
        super(message, 'DATABASE_CONNECTION_ERROR', 500);
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
