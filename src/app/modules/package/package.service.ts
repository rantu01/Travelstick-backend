import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Package from './package.model';
export class PackageService {
    static async createPackage(payload: any) {
        const data = await Package.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create package. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findPackageById(_id: Types.ObjectId | string) {
        const data = await Package.findOne({ _id: _id })
            .populate({ path: 'destination', select: 'address name image' })
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Package not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findPackageByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Package.findOne(query)
            .select('-updatedAt -__v')
            .populate({ path: 'destination', select: 'address name image' })
            .populate({ path: 'activities', select: 'name' });
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Package not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findPackagesWithPagination(
        filter: Record<string, string | boolean | number | Types.ObjectId>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Package.aggregate([
            {
                $lookup: {
                    from: 'activities',
                    localField: 'activities',
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
                    as: 'activity',
                },
            },
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
                    from: 'packages',
                    let: { destinationId: '$destination._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                '$destination',
                                                '$$destinationId',
                                            ],
                                        },
                                        { $eq: ['$status', true] },
                                    ],
                                },
                            },
                        },
                        {
                            $count: 'count',
                        },
                    ],
                    as: 'destination_packages',
                },
            },
            {
                $lookup: {
                    from: 'package_reviews',
                    localField: '_id',
                    pipeline: [
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
                    foreignField: 'package',
                    as: 'package_reviews',
                },
            },
            {
                $addFields: {
                    total_packages: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    '$destination_packages.count',
                                    0,
                                ],
                            },
                            0,
                        ],
                    },
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
                    duration: {
                        $dateDiff: {
                            startDate: '$check_in',
                            endDate: '$check_out',
                            unit: 'day',
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
                    rounded_review: {
                        $round: [
                            {
                                $cond: {
                                    if: {
                                        $eq: [{ $size: '$package_reviews' }, 0],
                                    },
                                    then: 0,
                                    else: {
                                        $avg: '$package_reviews.total_avg',
                                    },
                                },
                            },
                            0,
                        ],
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
        return await Package.aggregatePaginate(aggregate, options);
    }
    static async findPackagesForSidebar() {
        const aggregate = await Package.aggregate([
            {
                $group: { _id: null },
            },
            {
                $lookup: {
                    from: 'destinations',
                    pipeline: [
                        {
                            $match: { status: true, is_deleted: false },
                        },
                        {
                            $project: { address: 1, name: 1 },
                        },
                        {
                            $lookup: {
                                from: 'packages',
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
                                as: 'package',
                            },
                        },
                        { $addFields: { count: { $size: '$package' } } },
                        { $project: { package: 0 } },
                    ],
                    as: 'destination',
                },
            },
            {
                $lookup: {
                    from: 'packages',
                    pipeline: [
                        {
                            $project: { price: 1, name: 1 },
                        },
                        {
                            $addFields: {
                                current_price: {
                                    $cond: [
                                        {
                                            $eq: [
                                                '$price.discount_type',
                                                'flat',
                                            ],
                                        },
                                        {
                                            $subtract: [
                                                '$price.amount',
                                                '$price.discount',
                                            ],
                                        },
                                        {
                                            $subtract: [
                                                '$price.amount',
                                                {
                                                    $divide: [
                                                        {
                                                            $multiply: [
                                                                '$price.amount',
                                                                '$price.discount',
                                                            ],
                                                        },
                                                        100,
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'package',
                },
            },
            {
                $lookup: {
                    from: 'activities',
                    pipeline: [
                        {
                            $match: {
                                status: true,
                                is_deleted: false,
                            },
                        },
                        {
                            $project: { name: 1 },
                        },
                        {
                            $lookup: {
                                from: 'packages',
                                let: { actId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $in: ['$$actId', '$activities'],
                                            },
                                        },
                                    },
                                    { $project: { _id: 1, activities: 1 } },
                                ],
                                as: 'package',
                            },
                        },
                        { $addFields: { count: { $size: '$package' } } },
                        { $project: { count: 1, name: 1 } },
                    ],
                    as: 'activities',
                },
            },
            {
                $lookup: {
                    from: 'package_reviews',
                    pipeline: [
                        {
                            $match: {
                                package: { $exists: true },
                            },
                        },
                        {
                            $addFields: {
                                total: {
                                    $round: {
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
                                max_price: {
                                    $ceil: {
                                        $max: '$package.current_price',
                                    },
                                },
                                min_price: {
                                    $floor: {
                                        $min: '$package.current_price',
                                    },
                                },
                            },
                        },
                        {
                            key: 'activities',
                            values: '$activities',
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
                    destination: 0,
                    package: 0,
                    activities: 0,
                },
            },
        ]);
        return aggregate[0].elements;
    }
    static async updatePackage(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Package.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }

    static async deletePackageById(_id: string | Types.ObjectId) {
        const data = await Package.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to delete package.',
            );
        }
        return data;
    }
}
