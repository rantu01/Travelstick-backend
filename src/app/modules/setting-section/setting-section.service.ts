import Page from './setting-section.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import Section from './setting-section.model';

export class SettingSectionService {
    static async createSections(payload: any) {
        const data = await Section.insertMany(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create section. Please check all the fields and try again',
            );
        }
    }
    static async findSectionById(_id: string | Types.ObjectId) {
        const data = await Section.findById(_id)
            .select('-__v -updatedAt')
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Section  not found! Please try again.!',
            );
        }
        return data;
    }
    static async findSectionByQuery(
        filter: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const data = await Section.findOne(filter).select('-__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Section not found! please check and try again.!',
            );
        }
        return data;
    }
    static async findSections(
        filter: Record<string, string | boolean | Types.ObjectId>,
        query: Record<string, string | boolean | Types.ObjectId>,
        select: Record<string, string | boolean | Types.ObjectId>,
    ) {
        return await Page.find(filter).sort({ createdAt: -1 }).select(select);
    }

    static async updateSection(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Section.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }
    static async deleteSectionById(_id: string | Types.ObjectId) {
        const page = await Section.findByIdAndDelete(_id);
        if (!page) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Page not found! Please try again.',
            );
        }
        return page;
    }
}
