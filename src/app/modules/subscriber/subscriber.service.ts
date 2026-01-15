import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import Subscriber from './subscriber.model';
import { Types } from 'mongoose';

export class SubscriberService {
    static async createSubscribers(payload: any) {
        const data = await Subscriber.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create Subscriber! Please try again.',
            );
        }
        return data;
    }
    static async findSubscriberListByQuery(
        filter: any,
        query: Record<string, string | Types.ObjectId>,
        _permission: boolean = true,
    ) {
        const aggregate = Subscriber.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    __v: 0,
                    updatedAt: 0,
                },
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Subscriber.aggregatePaginate(aggregate, options);
    }
    static async findSubscriberByQuery(
        filter: any,
        query: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const data = await Subscriber.findOne(filter).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Subscriber not found ! Please try again.',
            );
        }
        return data;
    }

    static async deleteSubscriberById(_id: string | Types.ObjectId) {
        const data =
            await Subscriber.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Subscriber not found.',
            );
        }
        return data;
    }
}
