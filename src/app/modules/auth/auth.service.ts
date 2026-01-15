import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import User from '../user/user.model';

export class AuthService {
    static async forgetPasswordTokenBased(payload: any, _id: string) {
        if (payload.password !== payload.confirm_password) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Bad request',
                'Password and confirm password does not match!',
            );
        }
        const hashedPassword = await bcrypt.hash(
            payload.password as string,
            Number(config.bcrypt_salt_rounds),
        );
        await User.findByIdAndUpdate(_id, {
            $set: { password: hashedPassword },
        });
    }
}
