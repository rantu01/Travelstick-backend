import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { VisaService } from './visa.service';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ObjectId } from 'mongodb';
import { ServiceService } from '../service/service.service';
import mongoose from 'mongoose';
import { TPaymentMethodPayload } from '../payment/payment.interface';
import { PaymentService } from '../payment/payment.service';
import { PackageBookingService } from '../package-booking/package-booking.service';
import { generateBookingId } from '../package-booking/package-booking.utils';
import {
    executePaypalPayment,
    executeRazorpayPayment,
    executeStripePayment,
    generateTransactionId,
} from '../payment/payment.utils';
import { ReviewService } from '../review/review.service';
import { deleteFiles } from '../file/file.utils';

const sanitizeVisaPayload = (payload: any) => {
    if (!payload || typeof payload !== 'object') return {};

    const allowed = {
        title: payload.title,
        banner_image: payload.banner_image,
        card_image: payload.card_image,
        images: payload.images,
        visa_type: payload.visa_type,
        citizen_of: payload.citizen_of,
        travelling_to: payload.travelling_to,
        validity: payload.validity,
        processing_type: payload.processing_type,
        visa_mode: payload.visa_mode,
        country: payload.country,
        price: payload.price,
        overview: payload.overview,
        documents: payload.documents,
        document_about: payload.document_about,
        feathers: payload.feathers,
        faqs: payload.faqs,
        status: payload.status,
        visa_code: payload.visa_code,
        max_stay_days: payload.max_stay_days,
        entry_type: payload.entry_type,
        visa_category: payload.visa_category,
    };

    return Object.fromEntries(
        Object.entries(allowed).filter(([, value]) => value !== undefined),
    );
};

export class VisaController {
    static postVisas = catchAsync(async (req, res) => {
        const body = sanitizeVisaPayload(req.body?.body);
        await VisaService.createVisa(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Visa created successfully',
            data: undefined,
        });
    });
    static getVisasByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = req.query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                {
                    [`title.${langCode}`]: {
                        $regex: new RegExp(query.search.trim(), 'i'),
                    },
                },
            ];
        }
        if (query._id) {
            const data = await VisaService.findVisaById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Visa get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await VisaService.findVisasWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa list get successfully',
            data: dataList,
        });
    });
    static getVisasByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        const langCode = req.query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                {
                    [`title.${langCode}`]: {
                        $regex: new RegExp(query.search.trim(), 'i'),
                    },
                },
            ];
        }
        if (query.maxPrice && query.minPrice) {
            filter['current_price'] = {
                $lte: parseFloat(query.maxPrice),
                $gte: parseFloat(query.minPrice),
            };
        }
        if (query.visa_type) {
            filter['visa_type._id'] = new ObjectId(query.visa_type);
        }
        if (query.visa_mode) {
            filter['visa_mode'] = query.visa_mode;
        }
        if (query.country) {
            filter['country'] = query.country;
        }
        // ✅ citizen_of filter
        if (query.citizen_of) {
            filter['citizen_of'] = query.citizen_of;
        }
        // ✅ travelling_to filter
        if (query.travelling_to) {
            filter['travelling_to'] = query.travelling_to;
        }
        if (query.validity) {
            filter['validity'] = query.validity;
        }

        if (query._id) {
            const data = await VisaService.findVisaById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Visa get successfully',
                data: {
                    ...data,
                    current_price:
                        data.price.discount_type == 'flat'
                            ? data.price.amount - data.price.discount
                            : data.price.amount -
                            (data.price.amount * data.price.discount) / 100,
                },
            });
        }
        const select = {
            banner_image: 0,
            images: 0,
            updatedAt: 0,
            hotel_type: 0,
            language: 0,
            validity: 0,
            processing_type: 0,
            document_about: 0,
            faqs: 0,
            documents: 0,
            overview: 0,
            country: 0,
            visa_mode: 0,
            status: 0,
            __v: 0,
        };
        const dataList = await VisaService.findVisasWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa list get successfully',
            data: dataList,
        });
    });
    static getVisasForSidebar = catchAsync(async (req, res) => {
        const dataList = await VisaService.findVisaForSidebar();
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa sidebar list get successfully',
            data: dataList,
        });
    });
    static getVisaById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await VisaService.findVisaById(id);
        const current_price =
            data.price.discount_type == 'flat'
                ? data.price.amount - data.price.discount
                : data.price.amount -
                  (data.price.amount * data.price.discount) / 100;
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa get successfully',
            data: {
                ...data.toObject?.(),
                current_price,
            },
        });
    });
    static updateVisas = catchAsync(async (req, res) => {
        const rawBody = req.body?.body || {};
        if (!rawBody?._id) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Visa id is required for update.',
            );
        }

        const body = sanitizeVisaPayload(rawBody);
        await VisaService.findVisaById(rawBody._id);
        await VisaService.updateVisa({ _id: rawBody._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Visa updated successfully',
            data: undefined,
        });
    });
    static deleteVisas = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await VisaService.findVisaById(id);
        const deletedImage = data.images;
        deletedImage.push(data.banner_image);
        deletedImage.push(data.card_image);
        if (data.feathers)
            data.feathers.forEach((item: any) => deletedImage.push(item?.logo));
        await deleteFiles(deletedImage);
        await VisaService.deleteVisaById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa deleted successfully',
            data: undefined,
        });
    });
}
