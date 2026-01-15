import { Response, Request } from 'express';
import httpStatus from 'http-status';
const notFoundHandler = (_req: Request, res: Response): void => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'API not found !',
        // errorMessage  : null,
        // errorDetails: null,
    });
};
export default notFoundHandler;
