import BlogCategory from './blog-category.model';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';

export class BlogCategoryService {
    static async createBlogCategory(payload: any) {
        const data = await BlogCategory.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create blog category. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findBlogCategoryById(_id: string | Types.ObjectId) {
        const data = await BlogCategory.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog category not found.',
            );
        }
        return data;
    }
    static async findBlogCategoryByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await BlogCategory.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return data;
    }
    static async findBlogCategoriesWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = BlogCategory.aggregate([
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
        return await BlogCategory.aggregatePaginate(aggregate, options);
    }
    static async updateBlogCategory(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await BlogCategory.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Failed to update  blog category ! please try again',
            );
        }
        return data;
    }
    static async deleteBlogCategoryById(_id: string | Types.ObjectId) {
        const data = await BlogCategory.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found.',
            );
        }
        return data;
    }
}
