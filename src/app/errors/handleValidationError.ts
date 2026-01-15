import mongoose from 'mongoose';
import {
    TArrayOfErrorSources,
    TGenericErrorResponse,
} from '../interface/error';

const handleValidationError = (
    error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
    let errorsMessage: string = '';
    const statusCode = 400;
    const errorSources: TArrayOfErrorSources = Object.values(error.errors).map(
        (data: any, index) => {
            return {
                path: data?.path,
                message: data?.message,
            };
        },
    );
    errorSources.forEach((el, ind) => {
        errorsMessage +=
            el.message.toString() +
            (errorSources?.length - 1 === ind ? '.' : '. ');
    });
    return {
        statusCode,
        message: 'Validation Error',
        errorMessage: errorsMessage,
        errorDetails: error,
    };
};

export default handleValidationError;
