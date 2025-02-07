import { STATUS_CODES } from "http";

export class HttpError extends Error {
    errorCode: number;
    message: string;
    constructor(errorCode: number, message?: string) {
        super();

        Error.captureStackTrace(this, this.constructor);

        this.errorCode = errorCode || 500;

        this.message = message || STATUS_CODES[this.errorCode] as string;
    }
}