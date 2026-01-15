import { catchAsync } from '../../utils/catchAsync';
import { SettingPageService } from './setting-page.service';
import AppError from '../../errors/AppError';
import sendResponse from '../../utils/sendResponse';
import { HttpStatusCode } from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Setting from '../setting/setting.model';
import Page from './setting-page.model';

export class SettingPageController {
    static getPageListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        let data = null;
        const filter: any = {};
        if (query.slug) filter['slug'] = query.slug;
        if (query.theme) filter['theme'] = query.theme;
        if (query.status) filter['status'] = query.status === 'true';
        if (query.slug || query.theme) {
            data = await SettingPageService.findPageByQuery(filter, false);
            if (!data) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed',
                    'The page can not exists. Please try again.',
                );
            }
        } else {
            data = await SettingPageService.findPageListByQuery({}, {}, false);
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: `Get page ${query.slug ? '' : 'list'} Successfully`,
            data,
        });
    });
    static updatePageBYAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const page = await SettingPageService.findPageById(body._id);
        if (!page) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed',
                'The page can not exists. Please try again.',
            );
        }
        if (page.slug == 'home_page' && body.status) {
            await Page.updateMany({ slug: 'home_page' }, { status: false });
        }
        await SettingPageService.updatePageByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Update page successfully',
            data: undefined,
        });
    });
}
