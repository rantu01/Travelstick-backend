import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import BlogTag from './blog-tag.model';
export class BlogTagService {
    static async createBlogTag(payload: any) {
        const data = await BlogTag.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create blog tag. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findBlogTagById(_id: string | Types.ObjectId) {
        const data = await BlogTag.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog tag not found ! please check your id and try again',
            );
        }
        return data;
    }
    static async findBlogTagByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const blog = await BlogTag.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!blog && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Blog not found ! please check and try again',
            );
        }
        return blog;
    }
    static async findBlogTagsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = BlogTag.aggregate([
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
        return await BlogTag.aggregatePaginate(aggregate, options);
    }
    static async updateBlogTag(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await BlogTag.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        return data;
    }
    static async deleteBlogTagById(_id: string | Types.ObjectId) {
        const blog = await BlogTag.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        return blog;
    }
}
