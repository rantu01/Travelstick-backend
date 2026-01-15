import OTP from './otp.model';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';

export class OTPService {
    static async postOTPByEmail({
        email,
        code,
        action,
    }: {
        email: string;
        code: string;
        action: string;
    }): Promise<void> {
        await OTP.create({
            email: email.toLowerCase().trim(),
            code,
            action,
        });
    }
    static async findOTPByEmail({
        email,
        code,
        action,
        permission = true,
    }: {
        email: string;
        code: string;
        action: string;
        permission: boolean | undefined;
    }): Promise<any> {
        const otp_data = await OTP.findOne({
            email: email.toLowerCase().trim(),
            code,
            action,
        });

        if (!otp_data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Invalid or Expired OTP!',
            );
        }
        return otp_data;
    }
    static async findOtpByPhone({
        phone,
        code,
        action,
        permission = true,
    }: {
        phone: string;
        code: string;
        action: string;
        permission: boolean | undefined;
    }): Promise<any> {
        const otp_data = await OTP.findOne({
            phone: phone.trim(),
            code,
            action,
        });
        if (!otp_data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Invalid or Expired OTP!',
            );
        }
        return otp_data;
    }
    static async findOneByQuery(query: any, permission: boolean): Promise<any> {
        const otp_data = await OTP.findOne(query);
        if (!otp_data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Invalid or Expired OTP!',
            );
        }
        return otp_data;
    }
}
