import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { VisaTypeService } from './visa-type.service';

export class VisaTypeController {
    static postVisaTypes = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await VisaTypeService.findVisaTypeByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Visa type already exists . please change this visa type name',
            );
        }
        await VisaTypeService.createVisaType(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Visa type created successfully',
            data: undefined,
        });
    });
    static getVisaTypesByAdmin = catchAsync(async (req, res) => {
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
            const data = await VisaTypeService.findVisaTypeById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Visa type get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
            is_deleted: 0,
        };
        const dataList = await VisaTypeService.findVisaTypeWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa type list get successfully',
            data: dataList,
        });
    });
    static getVisaTypesByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
            status: true,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await VisaTypeService.findVisaTypeById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Visa type get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
            is_deleted: 0,
        };
        const dataList = await VisaTypeService.findVisaTypeWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa type list get successfully',
            data: dataList,
        });
    });
    static updateVisaTypes = catchAsync(async (req, res) => {
        const { body } = req.body;
        await VisaTypeService.findVisaTypeById(body._id);
        await VisaTypeService.updateVisaType({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa  type updated successfully',
            data: undefined,
        });
    });
    static deleteVisaTypes = catchAsync(async (req, res) => {
        const { id } = req.params;
        await VisaTypeService.findVisaTypeById(id);
        await VisaTypeService.deleteVisaTypeById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa type deleted successfully',
            data: undefined,
        });
    });
}
