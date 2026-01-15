import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Product from './product.model';

export class ProductService {
    static async createProduct(payload: any) {
        const data = await Product.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create new product! please try again',
            );
        }
        return data;
    }
    static async findProductById(_id: string | Types.ObjectId) {
        const data = await Product.findById(_id)
            .populate({ path: 'category', select: 'name' })
            .select('-updatedAt -__v')
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. please check product id and try again',
            );
        }
        return data;
    }
    static async findProductByQuery(filter: any, permission: boolean = true) {
        const data = await Product.findOne(filter).select('-updateAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. please check  and try again',
            );
        }
        return data;
    }
    static async findProductsWithPagination(
        filter: Record<string, string | Types.ObjectId>,
        query: Record<string, string | number>,
        select: Record<string, string | number>,
    ) {
        const aggregate = Product.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'project_categories',
                    localField: 'category',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    regular_price: '$price.amount',
                    final_price: {
                        $cond: {
                            if: { $eq: ['$price.discount_type', 'flat'] },
                            then: {
                                $subtract: ['$price.amount', '$price.discount'],
                            },
                            else: {
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
                        },
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
        return await Product.aggregatePaginate(aggregate, options);
    }
    static async updateProduct(
        query: Record<string, string | boolean | number>,
        updatedDocument: any,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Product.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. please check product id and try again',
            );
        }
        return data;
    }
    static async deleteProductById(_id: string | Types.ObjectId) {
        const data = await Product.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. Please verify the product ID and try again.!',
            );
        }
        return data;
    }
}
