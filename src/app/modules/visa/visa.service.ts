import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Visa from './visa.model';
export class VisaService {
    static async createVisa(payload: any) {
        const data = await Visa.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create visa. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findVisaById(_id: Types.ObjectId | string) {
        const data = await Visa.findOne({ _id: _id })
            .populate({ path: 'visa_type', select: 'name' })
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Visa not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findVisaByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Visa.findOne(query)
            .select('-updatedAt -__v')
            .populate({ path: 'visa_type', select: 'name' })
            .lean();
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Visa not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findVisasWithPagination(
        filter: Record<string, string | boolean | number | Types.ObjectId>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Visa.aggregate([
            {
                $lookup: {
                    from: 'visa_types',
                    localField: 'visa_type',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'visa_type',
                },
            },

            {
                $unwind: {
                    path: '$visa_type',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $addFields: {
                    regular_price: '$price.amount',
                    current_price: {
                        $cond: {
                            if: { $eq: ['$price.discount_type', 'flat'] },
                            then: {
                                $subtract: ['$price.amount', '$price.discount'],
                            },
                            else: {
                                $subtract: [
                                    '$price.amount',
                                    {
                                        $multiply: [
                                            '$price.amount',
                                            {
                                                $divide: [
                                                    '$price.discount',
                                                    100,
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
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
        return await Visa.aggregatePaginate(aggregate, options);
    }
    static async findVisaForSidebar() {
        const visa_type = await Visa.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$visa_type',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'visa_types',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'visa_type',
                },
            },
            {
                $unwind: {
                    path: '$visa_type',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: '$visa_type._id',
                    name: '$visa_type.name',
                    count: 1,
                },
            },
        ]);
        const price = await Visa.aggregate([
            {
                $addFields: {
                    regular_price: '$price.amount',
                    current_price: {
                        $cond: {
                            if: { $eq: ['$price.discount_type', 'flat'] },
                            then: {
                                $subtract: ['$price.amount', '$price.discount'],
                            },
                            else: {
                                $subtract: [
                                    '$price.amount',
                                    {
                                        $multiply: [
                                            '$price.amount',
                                            {
                                                $divide: [
                                                    '$price.discount',
                                                    100,
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    max_price: {
                        $max: '$current_price',
                    },
                    min_price: {
                        $min: '$current_price',
                    },
                },
            },
        ]);
        return [
            {
                key: 'visa_type',
                values: visa_type,
            },
            {
                key: 'price',
                values: {
                    max_price: price[0].max_price
                        ? Math.ceil(price[0].max_price)
                        : 100,
                    min_price: price[0].min_price
                        ? Math.ceil(price[0].min_price)
                        : 0,
                },
            },
        ];
    }
    static async updateVisa(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Visa.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }

    static async deleteVisaById(_id: string | Types.ObjectId) {
        const data = await Visa.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to delete Visa service.',
            );
        }
        return data;
    }
}
