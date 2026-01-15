import { ZodError, ZodIssue } from 'zod';
import {
    TArrayOfErrorSources,
    TGenericErrorResponse,
} from '../interface/error';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
    let errorMessage: string = '';
    const statusCode = 422;
    const errorSources: TArrayOfErrorSources = error.issues.map(
        (issue: ZodIssue) => {
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue.message,
            };
        },
    );
    errorSources.forEach((data, index) => {
        errorMessage +=
            data.message + (errorSources?.length - 1 === index ? '.' : '. ');
    });

    return {
        statusCode,
        message: 'Validation Error',
        errorMessage: errorMessage,
        errorDetails: error,
    };
};

export default handleZodError;
