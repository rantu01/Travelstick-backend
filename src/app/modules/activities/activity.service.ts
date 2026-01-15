import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import Activity from './activity.model';
import AppError from '../../errors/AppError';

export class ActivityService {
    static async createActivity(payload: any) {
        const data = await Activity.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create activities. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findActivityById(_id: Types.ObjectId | string) {
        const data = await Activity.findById(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Activities not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findActivityByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Activity.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Activity not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findActivitiesWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Activity.aggregate([
            {
                $match: filter,
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Activity.aggregatePaginate(aggregate, options);
    }
    static async updateActivity(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Activity.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }

    static async deleteActivityById(_id: string | Types.ObjectId) {
        const data = await Activity.findByIdAndUpdate(_id, {
            is_deleted: true,
        });
        return data;
    }
}
