import { ApiError } from "./ApiError.js";

export class ValidationError extends ApiError {
    statusCode = 400;
    code = "VALIDATION_ERROR";

    constructor(message = "Invalid request") {
        super(message);
    }
}

export class UnauthorizedError extends ApiError {
    statusCode = 401;
    code = "UNAUTHORIZED";

    constructor(message = "Invalid credentials") {
        super(message);
    }
}

export class ForbiddenError extends ApiError {
    statusCode = 403;
    code = "FORBIDDEN";

    constructor(message = "Forbidden") {
        super(message);
    }
}

export class NotFoundError extends ApiError {
    statusCode = 404;
    code = "NOT_FOUND";

    constructor(message = "Resource not found") {
        super(message);
    }
}

export class ConflictError extends ApiError {
    statusCode = 409;
    code = "CONFLICT";

    constructor(message = "Resource already exists") {
        super(message);
    }
}
