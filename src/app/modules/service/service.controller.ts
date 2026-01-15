import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ServiceService } from './service.service';
import { ObjectId } from 'mongodb';

export class ServiceController {
    static getServicesByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.module) {
            filter['module'] = query.module;
        }
        if(query.search){
            filter[`title.${query.langCode || 'en'}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await ServiceService.findServiceById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Service get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await ServiceService.findServices(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service list get successfully',
            data: dataList,
        });
    });
    static getServicesByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        if (query.module) {
            filter['module'] = query.module;
        }
        if (query._id) {
            const data = await ServiceService.findServiceById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Service  get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            status: 0,
            updatedAt: 0,
        };
        const dataList = await ServiceService.findServices(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service list get successfully',
            data: dataList,
        });
    });
    static updateServices = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ServiceService.findServiceById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Service not found. Please verify the service ID and try again.',
            );
        }
        await ServiceService.updateService({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service updated successfully',
            data: undefined,
        });
    });
}
