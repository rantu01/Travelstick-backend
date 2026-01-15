/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Response, Request } from 'express';
import { ZodError } from 'zod';
import handleZodError from '../errors/handelZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import config from '../config';
import httpStatus from 'http-status';
import { TGenericErrorResponse } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
): any => {
    let statusCode: number = 500;
    let message: string = 'Something went wrong';
    let errorMessage: string = 'Server Side error';
    let errorDetails: unknown = null;
    console.log(error);
    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;
    } else if (error.name === 'ValidationError') {
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;
    } else if (error?.name === 'CastError') {
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;
    } else if (error?.code === 11000) {
        const simplifiedError = handleDuplicateError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;
    } else if (error instanceof AppError) {
        statusCode = error?.statusCode;
        message = error?.message;
        errorMessage = error?.errorMessage;
        errorDetails = error;
    } else if (error?.name === 'TokenExpiredError') {
        return res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            statusCode: 401,
            message: 'Unauthorized Access',
            errorMessage:
                'You do not have the necessary permissions to access this resource.',
            errorDetails: null,
            stack: null,
        });
    } else if (error instanceof Error) {
        errorMessage = error?.message || 'Internal server error';
        errorDetails = error;
    }
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessage,
        errorDetails,
        stack: config.node_env === 'development' ? error?.stack : null,
    });
};

export default globalErrorHandler;
