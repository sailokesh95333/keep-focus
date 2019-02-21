// # Errors Generator
// helper functions in order to make error generation easier

// import dependencies
import * as _ from 'lodash';

/**
 * GeneralError - custom base error class for easier error handling
 * @extends Error
 */
export class GeneralError extends Error {
    public statusCode: number;
    public errorType: string;

    /**
     * constructor - creates a new custom error
     *
     * @param {Object} options the error options (message, statusCode, errorType) 
     */
    public constructor(options?: any) {
        // check if options has been provided
        if(!options) options = {};
        // call super with the error message
        super( options.message || 'The server has encountered an error.');

        // set up error defaults
        this.statusCode = options.statusCode || 500;
        this.errorType = options.errorType || 'InternalServerError';
        this.name = this.constructor.name;

        // configure proper stack tracing
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(this.message)).stack;
        }
    }
}

/**
 * IncorrectUsageError - error used for handling incorrect usage (400)
 * @extends GeneralError
 */
export class IncorrectUsageError extends GeneralError {
    /**
     * constructor - creates a new incorrect usage error
     *
     * @param {Object} options the error options (message, statusCode, errorType) 
     */
    constructor(options?: any) {
        super(_.merge({
            statusCode: 400,
            errorType: 'IncorrectUsageError',
            message: 'errors.types.incorrectUsageError'
        }, options));
    }
}

/**
 * NotFoundError - error used for handling not found errors (404)
 * @extends GeneralError
 */
export class NotFoundError extends GeneralError {
    /**
     * constructor - creates a new not found error
     *
     * @param {Object} options the error options (message, statusCode, errorType) 
     */
    constructor(options?: any) {
        super(_.merge({
            statusCode: 404,
            errorType: 'NotFoundError',
            message: 'errors.types.notFoundError'
        }, options));
    }
}

/**
 * BadRequestError - error used for handling bad requests (400)
 * @extends GeneralError
 */
export class BadRequestError extends GeneralError {
    /**
     * constructor - creates a new bad request error
     *
     * @param {Object} options the error options (message, statusCode, errorType) 
     */
    constructor(options?: any) {
        super(_.merge({
            statusCode: 400,
            errorType: 'BadRequestError',
            message: 'errors.types.badRequestError'
        }, options));
    }
}