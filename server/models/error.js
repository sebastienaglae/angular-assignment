class AuthenticationRequiredError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationRequiredError';
        this.code = 401;
    }
}

class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.code = 403;
    }
}

class ObjectNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectNotFoundError';
        this.code = 404;
    }
}

module.exports = {
    AuthenticationRequiredError,
    AuthorizationError,
    ObjectNotFoundError
}