import { catchAsync } from '../../utils/catchAsync';
import { SettingSectionService } from './setting-section.service';
import AppError from '../../errors/AppError';
import sendResponse from '../../utils/sendResponse';
import { HttpStatusCode } from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Setting from '../setting/setting.model';
import Page from './setting-section.model';

export class SettingSectionController {
    static getSections = catchAsync(async (req, res) => {
        const { query }: any = req;
        let data = null;
        const filter: any = {};
        if (query.name) filter['slug'] = query.slug;
        if (query.status) filter['status'] = query.status === 'true';
        if (query._id || query.name) {
            data = await SettingSectionService.findSectionByQuery(filter);
        } else {
            data = await SettingSectionService.findSections(filter, query, {});
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: `Get section ${query.slug ? '' : 'list'} Successfully`,
            data,
        });
    });
    static updateSectionsBYAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const page = await SettingSectionService.findSectionById(body._id);
        if (!page) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed',
                'The section can not exists. Please try again.',
            );
        }

        await SettingSectionService.updateSection({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Update section successfully',
            data: undefined,
        });
    });
}
