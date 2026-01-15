import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Cart from './cart.model';

export class CartService {
    static async createCart(payload: any) {
        const data = await Cart.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create cart. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findCartById(_id: Types.ObjectId | string) {
        const data = await Cart.findOne({ _id: _id })
            .populate({ path: 'user', select: 'name image' })
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Cart not found ! please check your cart id and try again.',
            );
        }
        return data;
    }
    static async findCartByQuery(
        query: Record<string, string | boolean | number | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const data = await Cart.findOne(query)
            .select('-updatedAt -__v')
            .populate({ path: 'user', select: 'name image' });
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Cart not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findCartWithPagination(
        filter: Record<string, string | boolean | number | Types.ObjectId>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Cart.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1,
                                email: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                thumb_image: 1,
                                price: 1,
                                email: 1,
                            },
                        },
                        {
                            $addFields: {
                                current_price: {
                                    $cond: {
                                        if: {
                                            $eq: [
                                                '$price.discount_type',
                                                'flat',
                                            ],
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
                    ],
                    as: 'product',
                },
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true,
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
        return await Cart.aggregatePaginate(aggregate, options);
    }

    static async findCartCalculate(
        filter: Record<string, string | Types.ObjectId>,
    ) {
        const data = await Cart.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                thumb_image: 1,
                                price: 1,
                                email: 1,
                            },
                        },
                        {
                            $addFields: {
                                current_price: {
                                    $cond: {
                                        if: {
                                            $eq: [
                                                '$price.discount_type',
                                                'flat',
                                            ],
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
                    ],
                    as: 'product',
                },
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    total_price: {
                        $multiply: ['$product.current_price', '$quantity'],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total_price: { $sum: '$total_price' },
                },
            },
        ]);
        return data[0];
    }

    static async deleteCartByQuery(query: any) {
        await Cart.deleteMany(query);
    }
}
