import { ApiError } from "../base";

export class DatabaseError extends ApiError {
    statusCode = 503;
    code = "DATABASE_ERROR";

    constructor(message = "Something is up with database") {
        super(message);
    }
}
