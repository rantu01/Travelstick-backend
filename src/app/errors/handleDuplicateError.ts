/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
    const statusCode = 400;
    const match = error.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorDetails: TErrorSources = {
        path: '',
        message: `${extractedMessage} is already exists`,
    };
    return {
        statusCode,
        message: 'Duplicate error found',
        errorMessage: `${extractedMessage} is already exists`,
        errorDetails,
    };
};

export default handleDuplicateError;
