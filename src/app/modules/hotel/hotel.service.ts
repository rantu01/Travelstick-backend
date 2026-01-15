import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Hotel from './hotel.model';
export class HotelService {
    static async createHotel(payload: any) {
        const data = await Hotel.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create hotel. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findHotelById(_id: Types.ObjectId | string) {
        const data = await Hotel.findOne({ _id: _id })
            .populate({ path: 'destination', select: 'address name image' })
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Hotel not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findPackageByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Hotel.findOne(query)
            .select('-updatedAt -__v')
            .populate({ path: 'destination', select: 'address name image' });
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Hotel not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findHotelsWithPagination(
        filter: Record<string, string | boolean | number | Types.ObjectId>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Hotel.aggregate([
            {
                $lookup: {
                    from: 'destinations',
                    localField: 'destination',
                    pipeline: [
                        {
                            $project: {
                                address: 1,
                                name: 1,
                                image: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'destination',
                },
            },
            {
                $unwind: {
                    path: '$destination',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'package_reviews',
                    localField: '_id',
                    pipeline: [
                        {
                            $match: {
                                hotel: {
                                    $exists: true,
                                },
                            },
                        },
                        {
                            $addFields: {
                                total_avg: {
                                    $divide: [
                                        {
                                            $add: [
                                                '$location',
                                                '$service',
                                                '$amenities',
                                                '$price',
                                                '$room',
                                            ],
                                        },
                                        5,
                                    ],
                                },
                            },
                        },
                    ],
                    foreignField: 'hotel',
                    as: 'package_reviews',
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
                    reviews_count: {
                        $size: '$package_reviews',
                    },
                    average_review: {
                        $cond: {
                            if: { $eq: [{ $size: '$package_reviews' }, 0] },
                            then: 0,
                            else: {
                                $avg: '$package_reviews.total_avg',
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
        return await Hotel.aggregatePaginate(aggregate, options);
    }
    static async findHotelsForSidebar() {
        const aggregate = await Hotel.aggregate([
            {
                $group: {
                    _id: null,
                    max_price: {
                        $max: {
                            $cond: {
                                if: { $eq: ['$price.discount_type', 'flat'] },
                                then: {
                                    $subtract: [
                                        '$price.amount',
                                        '$price.discount',
                                    ],
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
                    min_price: {
                        $min: {
                            $cond: {
                                if: { $eq: ['$price.discount_type', 'flat'] },
                                then: {
                                    $subtract: [
                                        '$price.amount',
                                        '$price.discount',
                                    ],
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
            },
            {
                $lookup: {
                    from: 'destinations',
                    pipeline: [
                        {
                            $project: { address: 1, name: 1 },
                        },
                        {
                            $lookup: {
                                from: 'hotels',
                                let: { distId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    '$$distId',
                                                    '$destination',
                                                ],
                                            },
                                        },
                                    },
                                    { $project: { _id: 1, destination: 1 } },
                                ],
                                as: 'hotel',
                            },
                        },
                        { $addFields: { count: { $size: '$hotel' } } },
                        { $project: { hotel: 0 } },
                    ],
                    as: 'destination',
                },
            },
            {
                $lookup: {
                    from: 'hotels',
                    pipeline: [
                        {
                            $group: {
                                _id: '$hotel_type',
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: '$_id',
                                count: '$count',
                            },
                        },
                    ],
                    as: 'hotel_type',
                },
            },
            {
                $lookup: {
                    from: 'hotels',
                    pipeline: [
                        {
                            $group: {
                                _id: '$room_type',
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: '$_id',
                                count: '$count',
                            },
                        },
                    ],
                    as: 'room_type',
                },
            },
            {
                $lookup: {
                    from: 'package_reviews',
                    pipeline: [
                        {
                            $match: {
                                hotel: {
                                    $exists: true,
                                },
                            },
                        },
                        {
                            $addFields: {
                                total: {
                                    $divide: [
                                        {
                                            $add: [
                                                '$location',
                                                '$service',
                                                '$amenities',
                                                '$price',
                                                '$room',
                                            ],
                                        },
                                        5,
                                    ],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: '$package',
                                average_rating: {
                                    $avg: '$total',
                                },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                average_rating: { $round: '$average_rating' },
                                count: 1,
                            },
                        },
                    ],
                    as: 'package_review',
                },
            },
            {
                $addFields: {
                    elements: [
                        {
                            key: 'destination',
                            values: '$destination',
                        },
                        {
                            key: 'price',
                            values: {
                                max_price: '$max_price',
                                min_price: '$min_price',
                            },
                        },
                        {
                            key: 'hotel_type',
                            values: '$hotel_type',
                        },
                        {
                            key: 'room_type',
                            values: '$room_type',
                        },
                        {
                            key: 'reviews',
                            values: {
                                one: {
                                    $size: {
                                        $filter: {
                                            input: '$package_review',
                                            as: 'review',
                                            cond: {
                                                $eq: [
                                                    '$$review.average_rating',
                                                    1,
                                                ],
                                            },
                                        },
                                    },
                                },
                                two: {
                                    $size: {
                                        $filter: {
                                            input: '$package_review',
                                            as: 'review',
                                            cond: {
                                                $eq: [
                                                    '$$review.average_rating',
                                                    2,
                                                ],
                                            },
                                        },
                                    },
                                },
                                three: {
                                    $size: {
                                        $filter: {
                                            input: '$package_review',
                                            as: 'review',
                                            cond: {
                                                $eq: [
                                                    '$$review.average_rating',
                                                    3,
                                                ],
                                            },
                                        },
                                    },
                                },
                                four: {
                                    $size: {
                                        $filter: {
                                            input: '$package_review',
                                            as: 'review',
                                            cond: {
                                                $eq: [
                                                    '$$review.average_rating',
                                                    4,
                                                ],
                                            },
                                        },
                                    },
                                },
                                five: {
                                    $size: {
                                        $filter: {
                                            input: '$package_review',
                                            as: 'review',
                                            cond: {
                                                $eq: [
                                                    '$$review.average_rating',
                                                    5,
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    max_price: 0,
                    min_price: 0,
                    hotel_type: 0,
                    room_type: 0,
                },
            },
        ]);
        return aggregate[0].elements;
    }
    static async updateHotel(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Hotel.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }

    static async deleteHotelById(_id: string | Types.ObjectId) {
        const data = await Hotel.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to delete hotel. please try again later',
            );
        }
        return data;
    }
}
