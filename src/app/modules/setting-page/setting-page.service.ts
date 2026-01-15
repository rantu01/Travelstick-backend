import Page from './setting-page.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';

export class SettingPageService {
    static async findPageById(_id: string | Types.ObjectId) {
        const page: any = await Page.findById(_id)
            .select('-__v -updatedAt')
            .lean();
        if (!page) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Page not found! Please try again.!',
            );
        }
        return page;
    }
    static async findPageListByQuery(
        filter: any,
        query: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const page = Page.find(filter).select('-__v');
        if (!page && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Page list not found!',
            );
        }
        return page;
    }
    static async findPageByQuery(
        filter: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const page = Page.findOne(filter).select('-__v');
        if (!page && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Page not found!',
            );
        }
        return page;
    }
    static async updatePageByQuery(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Page.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }
    static async deletePageById(_id: string | Types.ObjectId) {
        const page = await Page.findByIdAndDelete(_id);
        if (!page) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Page not found! Please try again.!',
            );
        }
        return page;
    }
}
