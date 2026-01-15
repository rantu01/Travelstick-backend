import { catchAsync } from '../utils/catchAsync';
import AppError from '../errors/AppError';

const employeePermission = (permission: string) =>
    catchAsync(async (req, res, next) => {
        const { user } = res.locals;
        if (
            user.role === 'admin' ||
            user.role === 'user' ||
            user?.permissions?.permissions?.includes(permission)
        ) {
            return next();
        }

        throw new AppError(
            401,
            'Unauthorized!',
            'Unauthorized to access this resource',
        );
    });

export default employeePermission;
