import Faq from './faq.model';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';

export class FaqService {
    static async createFaq(payload: any) {
        const data = await Faq.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create faq! Please try again.',
            );
        }
        return data;
    }
    static async findFaqById(_id: string | Types.ObjectId) {
        const data: any = await Faq.findById(_id)
            .select('-password -__v -updatedAt')
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Faq not found!',
            );
        }
        return data;
    }
    static async findFaqByQuery(query: any, permission: boolean = true) {
        const data = await Faq.findOne(query)
            .sort({ createdAt: -1 })
            .select('-updatedAt -__v')
            .lean();
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Faq not found!',
            );
        }
        return data;
    }

    static async findFaqListByQuery(
        filter: any,
        _query: Record<string, string | boolean | Types.ObjectId>,
        _permission: boolean = true,
    ) {
        const data = await Faq.find(filter)
            .sort({ createdAt: -1 })
            .lean()
            .select('-updatedAt -__v');
        return data;
    }
    static async updateFaq(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Faq.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }
    static async deleteFaqById(_id: string | Types.ObjectId) {
        const data = await Faq.findByIdAndDelete(_id).lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Faq not found!',
            );
        }
        return data;
    }
}
