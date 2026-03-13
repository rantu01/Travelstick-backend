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
        const valuePipeline = (field: string) => [
            {
                $match: {
                    status: true,
                    [field]: {
                        $nin: [null, ''],
                    },
                },
            },
            {
                $group: {
                    _id: `$${field}`,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: 1,
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ];

        const arrayValuePipeline = (field: string) => [
            {
                $match: {
                    status: true,
                    [field]: { $exists: true, $ne: [] },
                },
            },
            { $unwind: `$${field}` },
            {
                $match: {
                    [field]: { $nin: [null, ''] },
                },
            },
            {
                $group: {
                    _id: `$${field}`,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: 1,
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ];

        const [
            priceAggregate,
            distanceAggregate,
            destination,
            hotelType,
            roomType,
            neighborhood,
            starCategory,
            refundability,
            mealPlans,
            reservationPolicies,
            facilitiesServices,
            reviewsAggregate,
        ] = await Promise.all([
            Hotel.aggregate([
                {
                    $match: {
                        status: true,
                    },
                },
                {
                    $group: {
                        _id: null,
                        max_price: {
                            $max: {
                                $cond: {
                                    if: {
                                        $eq: ['$price.discount_type', 'flat'],
                                    },
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
                                    if: {
                                        $eq: ['$price.discount_type', 'flat'],
                                    },
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
            ]),
            Hotel.aggregate([
                {
                    $match: {
                        status: true,
                        distance_from_city: { $ne: null },
                    },
                },
                {
                    $group: {
                        _id: null,
                        max_distance: { $max: '$distance_from_city' },
                        min_distance: { $min: '$distance_from_city' },
                    },
                },
            ]),
            Hotel.aggregate([
                {
                    $match: {
                        status: true,
                    },
                },
                {
                    $lookup: {
                        from: 'destinations',
                        localField: 'destination',
                        foreignField: '_id',
                        as: 'destination',
                    },
                },
                {
                    $unwind: {
                        path: '$destination',
                        preserveNullAndEmptyArrays: false,
                    },
                },
                {
                    $group: {
                        _id: '$destination._id',
                        count: { $sum: 1 },
                        name: { $first: '$destination.name' },
                        address: { $first: '$destination.address' },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        count: 1,
                        name: 1,
                        address: 1,
                    },
                },
            ]),
            Hotel.aggregate(valuePipeline('hotel_type')),
            Hotel.aggregate(valuePipeline('room_type')),
            Hotel.aggregate(valuePipeline('neighborhood')),
            Hotel.aggregate(valuePipeline('star')),
            Hotel.aggregate(valuePipeline('refundability')),
            Hotel.aggregate(arrayValuePipeline('meal_plans')),
            Hotel.aggregate(arrayValuePipeline('reservation_policies')),
            Hotel.aggregate(arrayValuePipeline('facilities_services')),
            Hotel.aggregate([
                {
                    $match: {
                        hotel: { $exists: true },
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
                        _id: { $round: ['$total', 0] },
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const reviewMap = reviewsAggregate.reduce(
            (acc: Record<string, number>, item: { _id: number; count: number }) => {
                if (item._id >= 1 && item._id <= 5) {
                    const key =
                        item._id === 1
                            ? 'one'
                            : item._id === 2
                              ? 'two'
                              : item._id === 3
                                ? 'three'
                                : item._id === 4
                                  ? 'four'
                                  : 'five';
                    acc[key] = item.count;
                }
                return acc;
            },
            { one: 0, two: 0, three: 0, four: 0, five: 0 },
        );

        const price = priceAggregate?.[0] || { min_price: 0, max_price: 1000 };
        const distance = distanceAggregate?.[0] || {
            min_distance: 0,
            max_distance: 0,
        };

        return [
            { key: 'destination', values: destination || [] },
            {
                key: 'price',
                values: {
                    min_price: price.min_price || 0,
                    max_price: price.max_price || 1000,
                },
            },
            {
                key: 'distance_from_city',
                values: {
                    min_distance: distance.min_distance || 0,
                    max_distance: distance.max_distance || 0,
                },
            },
            { key: 'hotel_type', values: hotelType || [] },
            { key: 'room_type', values: roomType || [] },
            { key: 'neighborhood', values: neighborhood || [] },
            { key: 'star_category', values: starCategory || [] },
            { key: 'meal_plans', values: mealPlans || [] },
            {
                key: 'reservation_policies',
                values: reservationPolicies || [],
            },
            { key: 'refundability', values: refundability || [] },
            { key: 'facilities_services', values: facilitiesServices || [] },
            { key: 'reviews', values: reviewMap },
        ];
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
