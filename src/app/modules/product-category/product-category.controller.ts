import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ProductCategoryService } from './product-category.service';

export class ProductCategoryController {
    static createProductCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await ProductCategoryService.findProductCategoryByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Product category already exists',
            );
        }
        await ProductCategoryService.postProductCategoryByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Product category created successfully',
            data: undefined,
        });
    });
    static getCategoryListByAdmin = catchAsync(async (req, res) => {
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
            const data = await ProductCategoryService.findProductCategoryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Project category get successfully',
                data,
            });
        }
        const dataList =
            await ProductCategoryService.findProductCategoryListByQuery(
                filter,
                query,
                false,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Project category list get successfully',
            data: dataList,
        });
    });
    static updateProductCategoryByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ProductCategoryService.findProductCategoryById(body._id);

        await ProductCategoryService.updateProductCategoryByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product category updated successfully',
            data: undefined,
        });
    });
    static deleteProductCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ProductCategoryService.deleteProductCategoryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product category deleted successfully',
            data: undefined,
        });
    });
}
