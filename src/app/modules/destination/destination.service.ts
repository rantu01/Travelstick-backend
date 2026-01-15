import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import Destination from './destination.model';
import { Types } from 'mongoose';

export class DestinationService {
    static async createDestination(payload: any) {
        const data = await Destination.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create destination. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findDestinationById(_id: Types.ObjectId | string) {
        const data = await Destination.findById(_id)
            .select('-updatedAt -__v')
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Destination not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findDestinationByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Destination.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Destination not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findDestinationsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Destination.aggregate([
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
        return await Destination.aggregatePaginate(aggregate, options);
    }
    static async updateDestination(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Destination.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }

    static async deleteDestinationById(_id: string | Types.ObjectId) {
        const data = await Destination.findByIdAndUpdate(_id, {
            is_deleted: true,
        });
        return data;
    }
}
