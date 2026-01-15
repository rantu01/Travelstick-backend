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

export class VisaController {
    static postVisas = catchAsync(async (req, res) => {
        const { body } = req.body;
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
    static updateVisas = catchAsync(async (req, res) => {
        const { body } = req.body;
        await VisaService.findVisaById(body._id);
        await VisaService.updateVisa({ _id: body._id }, body);
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
