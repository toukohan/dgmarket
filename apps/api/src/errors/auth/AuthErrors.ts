import { ConflictError, UnauthorizedError, ForbiddenError } from "../base";

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
    constructor(message = "Invalid token") {
        super(message);
        this.code = "INVALID_TOKEN";
    }
}
