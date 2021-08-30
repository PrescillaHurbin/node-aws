class ApiError extends Error  {
    constructor(statusCode, message) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.statusCode = statusCode;
        this.message = message;
    }
};

module.exports = ApiError;