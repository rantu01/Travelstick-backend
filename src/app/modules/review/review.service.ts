import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import ReviewPackage from './review.model';
export class ReviewService {
    static async createReviewPackage(payload: any) {
        const data = await ReviewPackage.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed  to create new package review ! please try again',
            );
        }
        return data;
    }
    static async findReviewPackageById(_id: string | Types.ObjectId) {
        const data = await ReviewPackage.findById(_id)
            .populate({
                path: 'user',
                select: 'name image role address country',
            })
            .populate({
                path: 'package',
                select: 'name price',
            })
            .select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your review id and try again',
            );
        }
        return data;
    }
    static async findReviewPackageByQuery(
        filter: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data =
            await ReviewPackage.findOne(filter).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your product and try again',
            );
        }
        return data;
    }
    static async findReviewPackagesWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = ReviewPackage.aggregate([
            {
                $match: {
                    package: {
                        $exists: true,
                    },
                },
            },
            {
                $lookup: {
                    from: 'replays',
                    let: { id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$package_review', '$$id'],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: 'users',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            image: 1,
                                        },
                                    },
                                ],
                                localField: 'user',
                                as: 'user',
                            },
                        },
                        {
                            $unwind: {
                                path: '$user',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                user: 1,
                                comment: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                    as: 'replay',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1,
                                role: 1,
                                country: 1,
                                address: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'packages',
                    foreignField: '_id',
                    localField: 'package',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                            },
                        },
                    ],
                    as: 'package',
                },
            },
            {
                $unwind: {
                    path: '$package',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    rating: {
                        $divide: [
                            {
                                $sum: [
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
                $addFields: {
                    replay: {
                        $cond: [
                            { $gt: [{ $size: '$replay' }, 0] },
                            '$replay',
                            '$$REMOVE',
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
        return await ReviewPackage.aggregatePaginate(aggregate, options);
    }

    static async findReviewHotelsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = ReviewPackage.aggregate([
            {
                $match: {
                    hotel: {
                        $exists: true,
                    },
                },
            },
            {
                $lookup: {
                    from: 'replays',
                    let: { id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$package_review', '$$id'],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: 'users',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            image: 1,
                                        },
                                    },
                                ],
                                localField: 'user',
                                as: 'user',
                            },
                        },
                        {
                            $unwind: {
                                path: '$user',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                user: 1,
                                comment: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                    as: 'replay',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1,
                                role: 1,
                                country: 1,
                                address: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'hotels',
                    foreignField: '_id',
                    localField: 'hotel',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                            },
                        },
                    ],
                    as: 'hotel',
                },
            },
            {
                $unwind: {
                    path: '$hotel',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    rating: {
                        $divide: [
                            {
                                $sum: [
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
                $addFields: {
                    replay: {
                        $cond: [
                            { $gt: [{ $size: '$replay' }, 0] },
                            '$replay',
                            '$$REMOVE',
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
        return await ReviewPackage.aggregatePaginate(aggregate, options);
    }
    static async findReviewPackageWithCalculation(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = await ReviewPackage.aggregate([
            {
                $match: filter,
            },
            {
                $addFields: {
                    rating: {
                        $round: [
                            {
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
                            0,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    location: {
                        $avg: '$location',
                    },
                    service: {
                        $avg: '$service',
                    },
                    amenities: {
                        $avg: '$amenities',
                    },
                    price: {
                        $avg: '$price',
                    },
                    room: {
                        $avg: '$room',
                    },
                    rating_one: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$rating', 1] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    rating_two: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$rating', 2] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    rating_three: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$rating', 3] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    rating_four: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$rating', 4] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    rating_five: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$rating', 5] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    rating: {
                        $avg: [
                            '$location',
                            '$amenities',
                            '$service',
                            '$price',
                            '$room',
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    location: { $round: ['$location', 1] },
                    service: { $round: ['$service', 1] },
                    amenities: { $round: ['$amenities', 1] },
                    price: { $round: ['$price', 1] },
                    room: { $round: ['$room', 1] },
                    rating_one: { $round: ['$rating_one', 1] },
                    rating_two: { $round: ['$rating_two', 1] },
                    rating_three: { $round: ['$rating_three', 1] },
                    rating_four: { $round: ['$rating_four', 1] },
                    rating_five: { $round: ['$rating_five', 1] },
                    rating: { $round: ['$rating', 1] },
                },
            },
        ]);

        return aggregate[0];
    }
    static async updateReviewPackage(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await ReviewPackage.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update review! please try again',
            );
        }
        return data;
    }
    static async deleteReviewPackageById(_id: string | Types.ObjectId) {
        const data =
            await ReviewPackage.findByIdAndDelete(_id).select(
                '-updatedAt -__v',
            );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your review id and try again',
            );
        }
        return data;
    }
}
