import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { OfferService } from './offer.service';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import { SettingService } from '../setting/setting.service';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export class OfferController {
    static postOffers = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await OfferService.findOfferByQuery(
            {
                title: body.title,
            },
            false,
        );
        if (data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Offer already exists ! please change your offer title ',
            );
        }
        if (body.offer_type == 'monthly') {
            body['expireAt'] = new Date().setMonth(new Date().getMonth() + 1);
        } else if (body.offer_type == 'yearly') {
            body['expireAt'] = new Date().setFullYear(
                new Date().getFullYear() + 1,
            );
        } else {
            body['expireAt'] = new Date().setDate(new Date().getDate() + 7);
        }

        await OfferService.createOffer(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Offer created successfully',
            data: undefined,
        });
    });
    static getOffersByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query._id) {
            const data = await OfferService.findOfferById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Offer get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await OfferService.findOffers(filter, query, select);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Offer list get successfully',
            data: dataList,
        });
    });
    static getOffersByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = { status: true };
        if (query._id) {
            const data = await OfferService.findOfferById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Offer get successfully',
                data,
            });
        }
        const select = {
            title: 1,
            description: 1,
            image: 1,
            expireAt: 1,
            discount: 1,
            discount_type: 1,
        };
        const dataList = await OfferService.findOffers(filter, query, select);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Offer list get successfully',
            data: dataList,
        });
    });
    static updateOffers = catchAsync(async (req, res) => {
        const { body } = req.body;
        await OfferService.findOfferById(body._id);
        if (body.offer_type == 'monthly') {
            body['expireAt'] = new Date().setMonth(new Date().getMonth() + 1);
        } else if (body.offer_type == 'yearly') {
            body['expireAt'] = new Date().setFullYear(
                new Date().getFullYear() + 1,
            );
        } else if (body.offer_type == 'weakly') {
            body['expireAt'] = new Date().setDate(new Date().getDate() + 7);
        }
        await OfferService.updateOffer({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Offer updated successfully',
            data: undefined,
        });
    });
    static deleteOffers = catchAsync(async (req, res) => {
        const { id } = req.params;
        await OfferService.deleteOfferById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Offer deleted successfully',
            data: undefined,
        });
    });
}
