import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Blog from './blog.model';

export class BlogService {
    static async createBlog(payload: any) {
        const data = await Blog.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create blog ! Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findBlogById(_id: string | Types.ObjectId) {
        const data = await Blog.findById(_id)
            .populate({ path: 'author', select: 'name image' })
            .populate({ path: 'category', select: 'name' })
            .populate({ path: 'tags', select: 'name' })
            .select('-updatedAt -__v');

        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog not found ! Please check blog id and try again',
            );
        }
        return data;
    }
    static async findBlogByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Blog.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog not found.',
            );
        }
        return data;
    }
    static async findBlogsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Blog.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'author',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                image: 1,
                            },
                        },
                    ],
                    as: 'author',
                },
            },
            {
                $unwind: { path: '$author', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'blog_categories',
                    foreignField: '_id',
                    localField: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
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
                $lookup: {
                    from: 'blog_tags',
                    foreignField: '_id',
                    localField: 'tags',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            },
                        },
                    ],
                    as: 'tags',
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
        return await Blog.aggregatePaginate(aggregate, options);
    }
    static async findBlogCategoriesWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Blog.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'blog_categories',
                    foreignField: '_id',
                    localField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page | 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Blog.aggregatePaginate(aggregate, options);
    }
    static async updateBlog(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Blog.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  blog ! please try again',
            );
        }
        return data;
    }
    static async deleteBlogById(_id: string | Types.ObjectId) {
        const data =
            await Blog.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog not found.',
            );
        }
        return data;
    }
}
