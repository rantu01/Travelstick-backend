import { catchAsync } from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import httpStatus from 'http-status';

const modePermission = () =>
    catchAsync(async (req, res, next) => {
        if(config.mode == "demo" && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "Unauthorized for demo access",
                "This action is not allowed for demo accounts. "
            );
        }

        return next();
    });

export default modePermission;