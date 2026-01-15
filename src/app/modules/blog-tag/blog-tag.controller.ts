import { catchAsync } from '../../utils/catchAsync';
import { BlogTagService } from './blog-tag.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';

export class BlogTagController {
    static postBlogTags = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogTagService.findBlogTagByQuery(
            {
                name: body.name,
                is_delete: false,
            },
            false,
        );
        if (existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog Tag name already exists ! please change blog tag name',
            );
        }
        await BlogTagService.createBlogTag(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Tag name created successfully',
            data: undefined,
        });
    });
    static getBlogTagsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const tag = await BlogTagService.findBlogTagById(query._id);
            if (!tag) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Tag name can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Tag name get successfully',
                data: tag,
            });
        }
        const select = {
            is_deleted: 0,
            updatedAt: 0,
            __v: 0,
        };
        const tags = await BlogTagService.findBlogTagsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Blog tag list get successfully',
            data: tags,
        });
    });
    static updateBlogTags = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogTagService.findBlogTagById(body._id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Blog tag not found ! please check blog tag id and try again ',
            );
        }
        await BlogTagService.updateBlogTag({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Blog Tag updated successfully',
            data: undefined,
        });
    });
    static deleteBlogTags = catchAsync(async (req, res) => {
        const { id } = req.params;
        const existTeg = await BlogTagService.findBlogTagById(id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Tag name not found !',
            );
        }
        await BlogTagService.deleteBlogTagById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Tag name deleted successfully',
            data: undefined,
        });
    });
}
