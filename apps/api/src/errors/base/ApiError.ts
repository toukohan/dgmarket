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
