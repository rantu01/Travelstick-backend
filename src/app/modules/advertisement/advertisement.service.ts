import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Advertisement from './advertisement.model';
import { Types } from 'mongoose';
export class AdvertisementService {
    static async createByPayload(payload: any): Promise<any> {
        const data = await Advertisement.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create advertisement! Please try again.',
            );
        }
        return data;
    }
    static async findAddById(_id: string | Types.ObjectId) {
        const data = await Advertisement.findById(_id);

        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Advertisement not found! please try again.',
            );
        }
        return data;
    }
    static async findOneByQuery(
        filter: Record<string, string | Types.ObjectId>,
        query?: Record<string, string>,
        select?: string | undefined | Record<string, string>,
        permission: boolean = true,
    ): Promise<any> {
        const data = await Advertisement.findOne(filter)
            .select(select || {})
            .lean();
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Advertisement not found! please try again.',
            );
        }
        return data;
    }
    static async findListByQuery(
        filter: Record<string, string>,
        query: Record<string, string>,
        select: Record<string, string | number>,
        permission: boolean = true,
    ): Promise<any> {
        const aggregate = Advertisement.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'advertisement_clicks',
                    let: { advertisement: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$advertisement', '$$advertisement'],
                                },
                            },
                        },
                    ],
                    as: 'click',
                },
            },
            {
                $lookup: {
                    from: 'advertisement_impressions',
                    let: { advertisement: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$advertisement', '$$advertisement'],
                                },
                            },
                        },
                    ],
                    as: 'impression',
                },
            },
            {
                $addFields: {
                    impression: {
                        $size: '$impression',
                    },
                    click: {
                        $size: '$click',
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
        return await Advertisement.aggregatePaginate(aggregate, options);
    }
    static async updateByQuery(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        return await Advertisement.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
    }
    static async deleteById(_id: string | Types.ObjectId) {
        const data = await Advertisement.findOneAndDelete({ _id: _id });
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Advertisement can not exist.',
            );
        }
        return data;
    }
}
