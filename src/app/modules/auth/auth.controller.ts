import { catchAsync } from '../../utils/catchAsync';
import {
    validEmailCheck,
    comparePassword,
    createToken,
    verifyToken,
} from './auth.utils';
import { UserService } from '../user/user.service';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TTokenPayload } from './auth.interface';
import config from '../../config';
import sendResponse from '../../utils/sendResponse';
import { SettingService } from '../setting/setting.service';
import { OTPService } from '../otp/otp.service';
import dayjs from 'dayjs';
import { HttpStatusCode } from 'axios';
import { AuthService } from './auth.service';
import { getAuth } from 'firebase-admin/auth';
import firebaseAdmin from '../../utils/firebase';

export class AuthController {
    static loginAccess = catchAsync(async (req, res) => {
        // 1. Data extraction thik kora hoyeche (req.body.body bad diye req.body kora hoyeche)
        const { identifier, password, fcm_token } = req.body;

        // 2. Email ba Phone check kora
        const verificationResult = validEmailCheck(identifier);
        let user = null;

        if (verificationResult.success) {
            user = await UserService.findUserByEmail(identifier);
        } else {
            user = await UserService.findUserByPhoneNumber(identifier);
        }

        // 3. User asholei database e ache kina check (Crash avoid korar jonno)
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'Request failed', 'User not exists!');
        }

        // 4. User deleted kina check
        if (user.is_deleted === true) {
            throw new AppError(httpStatus.FORBIDDEN, 'Request failed', 'Your account has been deleted!');
        }

        // 5. Password matching (Database hash er sathe manual password check)
        const isPasswordMatched = await comparePassword(
            password,
            user.password,
        );

        if (!isPasswordMatched) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Bad Request',
                'Invalid login credentials!',
            );
        }

        // 6. FCM Token update logic
        if (fcm_token) {
            const user_fcm_token = [...(user.fcm_token || []), fcm_token];
            if (user_fcm_token.length > 2) {
                user_fcm_token.shift();
            }
            await UserService.updateUserWithFcm(
                { _id: user._id },
                { fcm_token: user_fcm_token },
            );
        }

        // 7. Token generation
        const tokenPayload: TTokenPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };

        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string,
        );

        const refreshToken = createToken(
            tokenPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string,
        );

        // 8. Cookie set and Response
        res.cookie('refreshToken', refreshToken, {
            secure: config.node_env === 'prod',
            httpOnly: true,
        });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User logged in successfully',
            data: {
                user: {
                    _id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    role: user?.role,
                },
                accessToken,
                refreshToken,
            },
        });
    });
    static refreshToken = catchAsync(async (req, res) => {
        const { refreshToken } = req.cookies;
        const decoded = verifyToken(
            refreshToken,
            config.jwt_refresh_secret as string,
        );
        const { _id } = decoded;
        const user = await UserService.findUserById(_id);
        const tokenPayload: any = {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            role: user?.role,
        };
        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string,
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'AccessToken generated Successfully',
            data: { accessToken },
        });
    });
    static forgetPasswordOTPVerify = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { identifier, action, otp } = body;
        const setting = await SettingService.findSettingBySelect({
            otp_verification_type: 1,
        });
        let otp_Object,
            user: any = null;
        const validationResult = validEmailCheck(identifier?.trim());
        if (
            !validationResult.success &&
            setting.otp_verification_type === 'email'
        ) {
            throw new AppError(400, 'Request Failed', 'Invalid email address');
        }
        if (setting.otp_verification_type === 'email') {
            otp_Object = await OTPService.findOTPByEmail({
                email: identifier,
                code: otp,
                action,
                permission: false,
            });
            user = await UserService.findUserByEmail(identifier);
        } else {
            otp_Object = await OTPService.findOtpByPhone({
                phone: identifier,
                code: otp,
                action,
                permission: false,
            });
            user = await UserService.findUserByPhoneNumber(identifier);
        }
        if (!otp_Object) {
            throw new AppError(
                400,
                'Failed to verify OTP',
                'Invalid or expired the OTP!',
            );
        }
        // check 1 min expiration time
        const startTime = dayjs(otp_Object.createdAt);
        const endTime = dayjs(Date.now());
        const expireTimesInMinute = endTime.diff(startTime, 'minute');
        if (expireTimesInMinute >= 2) {
            throw new AppError(
                400,
                'Invalid request',
                'OTP expired! Please try again.',
            );
        }
        if (
            otp_Object &&
            otp_Object?.attempts > 0 &&
            otp === otp_Object?.code
        ) {
            const tokenPayload: any = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            };
            const accessToken = createToken(
                tokenPayload,
                config.jwt_access_secret as string,
                config.jwt_access_expires_in as string,
            );
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: `OTP verified Successfully`,
                data: {
                    phone: validationResult.success ? undefined : identifier,
                    email: validationResult.success ? identifier : undefined,
                    accessToken,
                },
            });
            return;
        }
        if (otp_Object) {
            otp_Object.attempts -= 1;
            await otp_Object.save();
        }
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed',
            'Invalid OTP! Please try again.',
        );
    });
    static forgetPasswordSubmitTokenBased = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { _id } = res.locals.user;
        await AuthService.forgetPasswordTokenBased(body, _id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password updated Successfully',
            data: null,
        });
    });
    static userPasswordUpdate = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { _id, password } = res.locals.user;
        const isPasswordMatched = await comparePassword(
            body.old_password,
            password,
        );
        if (!isPasswordMatched) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Password not matched! Please try again.',
            );
        }
        await AuthService.forgetPasswordTokenBased(body, _id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password updated Successfully',
            data: undefined,
        });
    });
    static googleLoginAccess = catchAsync(async (req, res) => {
        const { body } = req.body;
        const decodedToken = await getAuth(firebaseAdmin).verifyIdToken(
            body.id_token,
        );
        let user = await UserService.findUserByEmail(
            decodedToken.email as string,
            false,
        );
        if (!user) {
            user = await UserService.createNewUser({
                name: decodedToken.name,
                email: decodedToken.email?.toLowerCase(),
                image: decodedToken.picture,
                role: body.role,
            });
        }
        if (body?.fcm_token) {
            await UserService.updateUserWithFcm(
                { _id: user._id },
                { fcm_token: body.fcm_token },
            );
        }
        const tokenPayload: TTokenPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string,
        );
        const refreshToken = createToken(
            tokenPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string,
        );
        res.cookie('refreshToken', refreshToken, {
            secure: config.node_env === 'prod',
            httpOnly: true,
        });
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User logged in successfully',
            data: {
                user: {
                    _id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    role: user?.role,
                },
                accessToken,
                refreshToken,
            },
        });
    });
}
