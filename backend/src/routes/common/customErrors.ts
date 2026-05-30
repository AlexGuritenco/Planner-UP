// here I will put error handling logic:
export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
export class BadRequestError extends CustomError {
    statusCode = 400;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class UnauthorizedError extends CustomError {
    statusCode = 401;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ForbiddenError extends CustomError {
    statusCode = 403;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ConflictError extends CustomError {
    statusCode = 409;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
