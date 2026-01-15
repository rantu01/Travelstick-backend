import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './blog.service';
import mongoose from 'mongoose';
export class BlogController {
    static postBlogs = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        await BlogService.createBlog({ ...body, author: user._id });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog created successfully',
            data: undefined,
        });
    });
    static getBlogsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await BlogService.findBlogById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Blog can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Blog get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const blog = await BlogService.findBlogsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog list get successfully',
            data: blog,
        });
    });
    static getBlogsByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_active: true,
        };
        const langCode = query.langCode || 'en';
        if (query.is_latest) {
            filter['is_latest'] = query.is_latest === 'true';
        }
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter['category'] = new mongoose.Types.ObjectId(query.category);
        }
        if (query._id) {
            const data = await BlogService.findBlogById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Blog can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Blog get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            tags: 0,
            // banner_image: 0,
            description: 0,
        };
        const blog = await BlogService.findBlogsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog list get successfully',
            data: blog,
        });
    });
    static getBlogCategoriesByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_active: true,
        };
        const select = {
            _id: 0,
            category: 1,
            count: 1,
        };
        const blog = await BlogService.findBlogCategoriesWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog Category list get successfully',
            data: blog,
        });
    });
    static updateBlogsByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await BlogService.findBlogById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog not found !',
            );
        }
        await BlogService.updateBlog({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog updated successfully',
            data: undefined,
        });
    });
    static deleteBlogsByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const exist = await BlogService.findBlogById(id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog not found !',
            );
        }
        await BlogService.deleteBlogById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog deleted successfully',
            data: undefined,
        });
    });
}
