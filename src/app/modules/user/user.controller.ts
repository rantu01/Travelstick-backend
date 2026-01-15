import { catchAsync } from '../../utils/catchAsync';
import { SettingService } from '../setting/setting.service';
import { OTPService } from '../otp/otp.service';
import { UserService } from './user.service';
import AppError from '../../errors/AppError';
import dayjs from 'dayjs';
import { createToken } from '../auth/auth.utils';
import config from '../../config';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { HttpStatusCode } from 'axios';
import { AuthService } from '../auth/auth.service';

export class UserController {
    static registerNewAccount = catchAsync(async (req, res) => {
        const { body } = req.body;
        const setting = await SettingService.findSettingBySelect({
            otp_verification_type: 1,
        });
        let otp,
            user = null;
        if (setting.otp_verification_type === 'email') {
            otp = await OTPService.findOTPByEmail({
                email: body.email,
                code: body.otp,
                action: 'signup',
                permission: false,
            });
            user = await UserService.findUserByEmail(body.email, false);
        } else {
            otp = await OTPService.findOtpByPhone({
                phone: body.phone,
                code: body.otp,
                action: 'signup',
                permission: false,
            });
            user = await UserService.findUserByPhoneNumber(body.phone, false);
        }

        if (!otp) {
            throw new AppError(
                400,
                'Failed to verify OTP',
                'Invalid or expired the OTP!',
            );
        }
        // check 1 min expiration time
        const startTime = dayjs(otp.createdAt);
        const endTime = dayjs(Date.now());
        const expireTimesInMinute = endTime.diff(startTime, 'minute');
        if (expireTimesInMinute >= 2) {
            throw new AppError(
                400,
                'Invalid request',
                'OTP expired! Please try again.',
            );
        }

        if (otp && otp?.attempts > 0 && body.otp === otp?.code) {
            if (user) {
                throw new AppError(
                    409,
                    'Failed to create account',
                    'User already exists with this email or phone number!',
                );
            }
            if (body.fcm_token) {
                body.fcm_token = [body.fcm_token];
            }
            const newUser = await UserService.createNewUser(body);
            const tokenPayload: any = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            };
            const accessToken = createToken(
                tokenPayload,
                config.jwt_access_secret as string,
                config.jwt_access_expires_in as string,
            );
            sendResponse(res, {
                statusCode: httpStatus.CREATED,
                success: true,
                message: 'Registration successful',
                data: { accessToken },
            });
            return;
        }
        if (otp) {
            otp.attempts -= 1;
            await otp.save();
        }
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed',
            'Invalid OTP! Please try again.',
        );
    });
    static postEmployeeProfile = catchAsync(async (req, res) => {
        const { body } = req.body;
        const user = await UserService.findUserByEmailOrPhone(
            body?.email,
            body?.phone,
            false,
        );
        if (user) {
            throw new AppError(
                400,
                'Request Failed!',
                'User already exists with this email or phone number!',
            );
        }
        const newUser = await UserService.createNewUser({
            name: body.name,
            phone: body.phone,
            email: body.email.toLowerCase(),
            role: 'employee',
            permissions: body.role,
            password: body.password,
        });
        const data = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
        };
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Create new employee successfully',
            data,
        });
    });
    static getUserProfile = catchAsync(async (req, res) => {
        const { user } = res.locals;
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Data fetched successfully',
            data: {
                ...user,
                password: undefined,
                __v: undefined,
                is_deleted: undefined,
                fcm_token: undefined,
            },
        });
    });
    static getUserListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            role: 'user',
            is_deleted: false,
        };
        if (query?.search) {
            filter['$or'] = [
                { name: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }

        if (query._id) {
            const data = await UserService.findUserById(query._id);
            delete data.is_deleted;
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Get user successfully',
                data,
            });
        }
        const data = await UserService.findUserListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Get User List successfully',
            data,
        });
    });
    static getEmployeeListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            role: 'employee',
            is_deleted: false,
        };
        if (query?.search) {
            filter['$or'] = [
                { name: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }

        if (query._id) {
            const data = await UserService.findUserById(query._id);
            delete data.is_deleted;
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Get employee successfully',
                data,
            });
        }
        const employee = await UserService.findUserListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Get employee List successfully',
            data: employee,
        });
    });
    static userProfileUpdate = catchAsync(async (req, res) => {
        const { _id } = res.locals.user;
        const { body } = req.body;
        const updateQuery = { _id };
        const updateDocument = {
            ...body,
            _id: undefined,
            role: undefined,
            password: undefined,
        };

        const user = await UserService.updateUserProfile(
            updateQuery,
            updateDocument,
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Profile updated successfully',
            data: {
                ...user,
                password: undefined,
                __v: undefined,
                is_deleted: undefined,
                fcm_token: undefined,
            },
        });
    });
    static employeeProfileUpdate = catchAsync(async (req, res) => {
        const { body } = req.body;
        const user: any = await UserService.findUserById(body._id);
        if (!user || user?.is_deleted === true) {
            throw new AppError(400, 'Request failed', 'User can not exists');
        }
        if (body?.password) {
            await AuthService.forgetPasswordTokenBased(
                {
                    password: body.password,
                    confirm_password: body.password,
                },
                body._id,
            );
        }
        const updateDocument = {
            phone: body?.phone || undefined,
            email: body?.email || undefined,
            permissions: body.role || undefined,
            name: body.name || undefined,
        };
        await UserService.updateUserProfile({ _id: body._id }, updateDocument);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Employee profile updated successfully',
            data: undefined,
        });
    });
    static userPasswordUpdate = catchAsync(async (req, res) => {
        const { body } = req.body;
        const user: any = await UserService.findUserById(body._id);
        console.log(user);
        if (!user || user?.is_deleted === true) {
            throw new AppError(400, 'Request failed', 'User can not exists');
        }
        await AuthService.forgetPasswordTokenBased(body, body._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password updated Successfully',
            data: undefined,
        });
    });
    static userProfileDeleteBYAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const user: any = await UserService.deleteUserById(id);
        if (user.is_deleted === true) {
            throw new AppError(400, 'Request failed', 'User Already Deleted');
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Account deleted successfully',
            data: undefined,
        });
    });
    static userProfileDelete = catchAsync(async (req, res) => {
        const { user } = res.locals;
        if (user.is_deleted === true) {
            throw new AppError(404, 'Request failed', 'User not exists!');
        }
        await UserService.deleteUserById(user._id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Account deleted successfully',
            data: undefined,
        });
    });
}
