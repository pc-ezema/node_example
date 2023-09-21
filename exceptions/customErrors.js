// customErrors.js

class BadRequestError extends Error {
    constructor(message = 'Bad Request') {
        super(message);
        this.name = 'BadRequestError';
        // this.statusCode = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
        // this.statusCode = 401;
    }
}

class ValidationError extends Error {
    constructor(message = 'Validation Error') {
        super(message);
        this.name = 'ValidationError';
        // this.statusCode = 422;
    }
}

class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
        // this.statusCode = 403;
    }
}

class NotFoundError extends Error {
    constructor(message = 'Not Found') {
        super(message);
        this.name = 'NotFoundError';
        // this.statusCode = 404;
    }
}

class MethodNotAllowedError extends Error {
    constructor(message = 'Method Not Allowed') {
        super(message);
        this.name = 'MethodNotAllowedError';
        // this.statusCode = 405;
    }
}

class ConflictError extends Error {
    constructor(message = 'Conflict') {
        super(message);
        this.name = 'ConflictError';
        // this.statusCode = 409;
    }
}

class InternalServerError extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.name = 'InternalServerError';
        // this.statusCode = 500;
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    MethodNotAllowedError,
    ConflictError,
    InternalServerError,
    ValidationError
};
