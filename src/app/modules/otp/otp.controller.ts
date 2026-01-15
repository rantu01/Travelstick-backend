import { catchAsync } from '../../utils/catchAsync';
import { SettingService } from '../setting/setting.service';
import AppError from '../../errors/AppError';
import { OTPService } from './otp.service';
import { validEmailCheck } from '../auth/auth.utils';
import { generateOTP } from './otp.utils';
import config from '../../config';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import { UserService } from '../user/user.service';

export class OTPController {
    static sendOTP = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { identifier, action } = body;
        const validationResult = validEmailCheck(identifier);
        const setting = await SettingService.findSettingBySelect({
            otp_verification_type: 1,
        });
        if (
            !validationResult.success &&
            setting.otp_verification_type === 'email'
        ) {
            throw new AppError(
                400,
                'Invalid request',
                'OTP already sent! Please try after 2 minutes.',
            );
        }
        let user = null;
        if (action != 'signup') {
            if (setting.otp_verification_type === 'email') {
                user = await UserService.findUserByEmail(identifier, false);
            } else {
                user = await UserService.findUserByPhoneNumber(
                    identifier,
                    false,
                );
            }
            if (!user) {
                throw new AppError(
                    404,
                    'Request Failed',
                    `No account found with this ${setting.otp_verification_type === 'email' ? 'email' : 'phone'}. Please try again or create a new account`,
                );
            }
        } else {
            if (setting.otp_verification_type === 'email') {
                user = await UserService.findUserByEmail(identifier, false);
            } else {
                user = await UserService.findUserByPhoneNumber(
                    identifier,
                    false,
                );
            }
            if (user) {
                throw new AppError(
                    404,
                    'Request Failed',
                    `Account found with this ${setting.otp_verification_type === 'email' ? 'email' : 'phone'}. Please try again `,
                );
            }
        }
        const otpPayload = {
            email: validationResult.success
                ? identifier?.toLowerCase().trim()
                : undefined,
            phone: validationResult.success ? undefined : identifier?.trim(),
            action: action,
        };
        const isAlreadySend = await OTPService.findOneByQuery(
            otpPayload,
            false,
        );
        if (isAlreadySend) {
            throw new AppError(
                400,
                'Request Failed',
                'OTP already send. Please wait and try again.',
            );
        }
        const otp = generateOTP(6);
        const settings = await SettingService.findSettingBySelect({});
        if (settings.otp_verification_type === 'email') {
            const data = {
                email: identifier?.toLowerCase().trim() as string,
                subject: `${config.website_name ? config.website_name + ': ' : ''}OTP verification code`,
                message: `<h3>Your verification OTP code is: </h3>
                       <div style="background-color: azure; margin: 01px 0px; padding: 5px">
                           <h3 style="margin-left: 5px; letter-spacing: 3px;">
                            ${otp}
                            </h3>
                       </div>
                       <h3>For any kind of help, please contact our support team.</h3>
                       Sincerely,
                       <br/>
                       ${config.website_name} | Contact No. ${settings?.site_phone}
                    `,
            };
            await sendUserEmailGeneral(data);
            await OTPService.postOTPByEmail({
                email: otpPayload.email,
                code: otp,
                action: otpPayload.action,
            });
        } else {
            // send sms
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `The verification OTP was sent to your ${validationResult.success ? 'email address.' : 'phone number.'}`,
            data: {
                type: validationResult.success ? 'email' : 'phone',
                identifier: identifier.trim(),
            },
        });
    });
}
