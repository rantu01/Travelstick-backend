import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Provider from './provider.model';

export class ProviderService {
    static async createProvider(payload: any) {
        const data = await Provider.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create new provider ! please try again',
            );
        }
        return data;
    }
    static async findProviderById(_id: string | Types.ObjectId) {
        const data = await Provider.findById(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Provider not found. please check provider id and try again',
            );
        }
        return data;
    }
    static async findProviderByQuery(
        filter: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Provider.findOne(filter).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Provider not found. please check and try again',
            );
        }
        return data;
    }
    static async findProvidersWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Provider.aggregate([
            {
                $match: filter,
            },
            {
                $addFields: {
                    specialist: {
                        $first: '$specialists',
                    },
                },
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
        return Provider.aggregatePaginate(aggregate, options);
    }

    static async updateProvider(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Provider.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Failed to update new provider ! please try again',
            );
        }
        return data;
    }
    static async deleteProviderById(_id: string | Types.ObjectId) {
        const data = await Provider.findOneAndUpdate(
            { _id },
            { is_deleted: true },
        ).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Provider  not found.',
            );
        }
        return data;
    }
}
