import httpStatus from 'http-status';
import { HttpStatusCode } from 'axios';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdvertisementService } from './advertisement.service';
import AppError from '../../errors/AppError';
import { AdvertisementClickService } from '../advertisement-click/advertisement-click.service';
import { AdvertisementImpressionService } from '../advertisement-impression/advertisement-impression.service';
export class AdvertisementController {
    static postAdvertisement = catchAsync(async (req, res) => {
        const { body } = req.body;
        const isExist = await AdvertisementService.findOneByQuery(
            { title: body.title },
            {},
            {},
            false,
        );
        if (isExist) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed',
                'Advertisement already exists | please try again .',
            );
        }
        await AdvertisementService.createByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Advertisement created successfully',
            data: undefined,
        });
    });
    static postAdvertisementClick = catchAsync(async (req, res) => {
        const { body } = req.body;
        await AdvertisementClickService.createByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Advertisement click created successfully',
            data: undefined,
        });
    });
    static postAdvertisementImpression = catchAsync(async (req, res) => {
        const { body } = req.body;
        await AdvertisementImpressionService.createByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Advertisement impression created successfully',
            data: undefined,
        });
    });
    static getAdvertisementBYAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        let data = null;
        const langCode: string = query.langCode || 'en';
        if (query.search) {
            filter['$or'] = [
                {
                    [`title.${langCode}`]: {
                        $regex: new RegExp(query.search.toString().trim(), 'i'),
                    },
                },
                {
                    type: {
                        $regex: new RegExp(query.search.toString().trim(), 'i'),
                    },
                },
            ];
        }
        if (query.status) {
            filter['status'] = query.status;
        }
        if (query._id) {
            data = await AdvertisementService.findOneByQuery(
                { _id: query._id },
                {},
                '-__v',
            );
        } else {
            const select = {
                __v: 0,
                updatedAt: 0,
            };
            data = await AdvertisementService.findListByQuery(
                filter,
                query,
                select,
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: `Advertisement get ${query._id ? '' : 'list'} successfully`,
            data: data,
        });
    });
    static getAdvertisementByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: {
                $eq: 'public',
            },
        };
        let data = null;
        const langCode: string = query.langCode || 'en';
        if (query.search) {
            filter['$or'] = [
                {
                    [`title.${langCode}`]: {
                        $regex: new RegExp(query.search.toString().trim(), 'i'),
                    },
                },
                {
                    type: {
                        $regex: new RegExp(query.search.toString().trim(), 'i'),
                    },
                },
            ];
        }
        if (query.status) {
            filter['status'] = query.status;
        }
        if (query._id) {
            data = await AdvertisementService.findOneByQuery(
                { _id: query._id },
                {},
                '-__v',
            );
        } else {
            const select = {
                __v: 0,
                click: 0,
                impression: 0,
                updatedAt: 0,
            };
            data = await AdvertisementService.findListByQuery(
                filter,
                query,
                select,
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: `Advertisement get ${query._id ? '' : 'list'} successfully`,
            data: data,
        });
    });
    static updateAdvertisementByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await AdvertisementService.findAddById(body._id);
        await AdvertisementService.updateByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Advertisement updated successfully',
            data: undefined,
        });
    });
    static deleteAdvertisementByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await AdvertisementService.deleteById(id);
        await AdvertisementClickService.deleteManyById(id);
        await AdvertisementImpressionService.deleteManyById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Advertisement deleted successfully',
            data: undefined,
        });
    });
}
