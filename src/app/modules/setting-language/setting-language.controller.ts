import { catchAsync } from '../../utils/catchAsync';
import { SettingLanguageService } from './setting-language.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

export class SettingLanguageController {
    static postLanguageSetting = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await SettingLanguageService.findLanguageByName(
            body.name,
            false,
        );
        if (data) {
            throw new AppError(400, 'Request Field', 'Language already exists');
        }
        if (typeof body.default !== 'undefined' && !!body.default) {
            await SettingLanguageService.updateLanguage({}, { default: false });
        }
        await SettingLanguageService.createLanguage(body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Create new language successfully',
            data: undefined,
        });
    });
    static getLanguagesByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { fields } = query;
        let data = null;
        const localFields =
            typeof fields === 'string'
                ? fields.split(',').join(' ')
                : 'name code flag default translations';
        const filter = { active: true };
        if (query?._id) {
            data = await SettingLanguageService.findLanguageById(query?._id);
        } else {
            data = await SettingLanguageService.findLanguageListByQuery(
                filter,
                localFields,
                false,
            );
        }

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `Get Language ${query?._id ? '' : 'list'} successfully`,
            data,
        });
    });
    static getLanguagesByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { fields } = query;
        let data = null;
        const localFields =
            typeof fields === 'string'
                ? fields.split(',').join(' ')
                : '-updatedAt -__v';
        const filter = {};
        if (query?._id) {
            data = await SettingLanguageService.findLanguageById(query?._id);
        } else {
            data = await SettingLanguageService.findLanguageListByQuery(
                filter,
                localFields,
                false,
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `Get Language  ${query?._id ? '' : 'list'} successfully`,
            data,
        });
    });
    static updateLanguageSetting = catchAsync(async (req, res) => {
        const { body } = req.body;
        const find = await SettingLanguageService.findLanguageById(body?._id);
        if (!find) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Field',
                'Language not found',
            );
        }
        if (typeof body.default !== 'undefined') {
            await SettingLanguageService.updateManyLanguage(
                {},
                { default: false },
            );
        }
        await SettingLanguageService.updateLanguage(
            {
                _id: body._id,
            },
            body,
        );

        // active one -->
        const exist = await SettingLanguageService.findLanguageByQuery(
            { default: true },
            false,
        );
        if (!exist) {
            await SettingLanguageService.updateLanguage(
                {
                    _id: body._id,
                },
                { default: true },
            );
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Field',
                'At last one language should be active .',
            );
        }

        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Language updated Successfully',
            data: undefined,
        });
    });
    static deleteLanguageSetting = catchAsync(async (req, res) => {
        const { _id } = req.params;
        const find = await SettingLanguageService.findLanguageById(_id);
        if (!find) {
            throw new AppError(404, 'Request Field', 'Language not found');
        }
        await SettingLanguageService.deleteLanguageById(_id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Language deleted successfully',
            data: undefined,
        });
    });
}
