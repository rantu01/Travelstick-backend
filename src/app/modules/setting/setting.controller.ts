import { catchAsync } from '../../utils/catchAsync';
import { SettingService } from './setting.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { generateID } from '../../utils/helpers';
import AppError from '../../errors/AppError';
import connectMongo from '../../config/database';
import { seedAdmin, seeders } from '../../utils/seeders';
import fs from 'node:fs';
import path from 'node:path';
import config from '../../config';

export class SettingController {
    static updateSettings = catchAsync(async (req, res) => {
        const { body } = req.body;
        const is_exist_S3 = config.aws_bucket_name ;
        if(!is_exist_S3 && body?.file_upload_type == 's3'){
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "AWS configuration error",
                "AWS credentials are missing from the environment variables. Please ensure that your .env file is properly configured with the required AWS access keys"
            );
        }

        await SettingService.updateSetting(body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings updated successfully',
            data: undefined,
        });
    });
    static getSettingsByPublic = catchAsync(async (req, res) => {
        const select = {
            _id: 1,
            site_name: 1,
            site_email: 1,
            site_phone: 1,
            site_logo: 1,
            banner_image: 1,
            login_upper_bg_image: 1,
            login_lower_bg_image: 1,
            otp_verification_type: 1,
            site_address: 1,
            site_description: 1,
            site_footer: 1,
            currency_code: 1,
            currency_symbol: 1,
            address: 1,
            social_media_link: 1,
            fav_icon: 1,
            gallery: 1,
            partner: 1,
            stripe: 1,
            paypal: 1,
            razorpay: 1,
            delivery_charge: 1,
            is_product_module: 1,
        };
        const data = await SettingService.findSettingBySelect(select);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings get successfully',
            data: {
                ...data._doc,
                payment_methods_logo: [
                    data.stripe.is_active ? data.stripe.logo : undefined,
                    data.paypal.is_active ? data.paypal.logo : undefined,
                    data.razorpay.is_active ? data.razorpay.logo : undefined,
                ],
                stripe: undefined,
                paypal: undefined,
                razorpay: undefined,
            },
        });
    });
    static getSettingsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const data = await SettingService.findSettingBySelect({});
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings get successfully',
            data,
        });
    });
    static postSettingsEnvByAdmin = catchAsync(async (req, res) => {
        const { adminInfo, valueString } = req.body;
        const valueENV: any = Object.entries(valueString)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const envValues =
            valueENV +
            '\n' +
            `BCRYPT_SALT_ROUNDS=10` +
            '\n' +
            `PORT=2025` +
            '\n' +
             "MODE=PROD"+
            '\n' +
            `JWT_ACCESS_SECRET=${generateID('RANDOM', 20) + Date.now()}` +
            '\n' +
            `JWT_ACCESS_EXPIRES_IN="30d"` +
            '\n' +
            `JWT_REFRESH_SECRET=${generateID('RANDOM', 20) + Date.now()}` +
            '\n' +
            `JWT_REFRESH_EXPIRES_IN="30d"`;

        if (adminInfo?.password !== adminInfo?.confirmPassword) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed',
                'Password invalid',
            );
        }
        await connectMongo(valueString.DB_STRING as string);
        await seedAdmin(adminInfo, valueString);
        const file = path.join(
            __dirname,
            `./../../../../.env.prod`,
        );
        fs.writeFileSync(file, envValues);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Settings env created successfully',
            data: {
                status: true,
                env: true,
            },
        });
    });
    static getSettingsEnvCheck = catchAsync(async (req, res) => {
        const envFilePath = path.resolve(
            `.env.prod`,
        );
        const exist = fs.existsSync(envFilePath);
        if (!exist) {
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'Settings env get successfully',
                data: {
                    status: true,
                    env: false,
                },
            });
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Settings env get successfully',
            data: {
                status: true,
                env: true,
            },
        });
        await connectMongo(config.db_string as string);
    });
}
