export abstract class ApiError extends Error {
    abstract statusCode: number;
    abstract code: string;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    serialize() {
        return {
            error: {
                code: this.code,
                message: this.message,
            },
        };
    }
}

export class ConflictError extends ApiError {
    statusCode = 409;
    code = "CONFLICT";

    constructor(message = "Resource already exists") {
        super(message);
    }
}

export class DatabaseError extends ApiError {
    statusCode = 503;
    code = "DATABASE_ERROR";

    constructor(message = "Something is up with database") {
        super(message);
    }
}

export class ForbiddenError extends ApiError {
    statusCode = 403;
    code = "FORBIDDEN";

    constructor(message = "Invalid credentials") {
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

export class UnauthorizedError extends ApiError {
    statusCode = 401;
    code = "UNAUTHORIZED";

    constructor(message = "Invalid credentials") {
        super(message);
    }
}

export class ValidationError extends ApiError {
    statusCode = 400;
    code = "VALIDATION_ERROR";

    constructor(message = "Invalid request") {
        super(message);
    }
}

// auth errors

export class EmailAlreadyExistsError extends ConflictError {
    constructor() {
        super("Email already registered");
        this.code = "EMAIL_ALREADY_EXISTS";
    }
}

export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super("Invalid email or password");
        this.code = "INVALID_CREDENTIALS";
    }
}

export class MissingTokenError extends UnauthorizedError {
    constructor() {
        super("Missing token");
        this.code = "MISSING_TOKEN";
    }
}

export class InvalidTokenError extends ForbiddenError {
    constructor(message: string) {
        super(message);
        this.code = "INVALID_TOKEN";
    }
}
