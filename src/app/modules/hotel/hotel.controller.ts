import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { HotelService } from './hotel.service';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ObjectId } from 'mongodb';
import { ServiceService } from '../service/service.service';
import mongoose from 'mongoose';
import { TPaymentMethodPayload } from '../payment/payment.interface';
import { PaymentService } from '../payment/payment.service';
import { generateBookingId } from '../package-booking/package-booking.utils';
import {
    executePaypalPayment,
    executeRazorpayPayment,
    executeStripePayment,
    generateTransactionId,
} from '../payment/payment.utils';
import { ReviewService } from '../review/review.service';
import { deleteFiles } from '../file/file.utils';
import { HotelBookingService } from '../hotel-booking/hotel-booking.service';
export class HotelController {
    static postHotels = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await HotelService.findPackageByQuery(
            {
                name: body.name,
            },
            false,
        );
        if (data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Hotel already exists ! please change package name',
            );
        }
        await HotelService.createHotel(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Hotel created successfully',
            data: undefined,
        });
    });
    static postHotelsBookingCalculation = catchAsync(async (req, res) => {
        const { body } = req.body;
        const filter: any = {
            check_in: {
                $gte: new Date(body.check_in),
            },
            check_out: {
                $lte: new Date(body.check_out),
            },
            status: 'confirmed',
            person: {
                $lt: {
                    $add: ['$person', body.person],
                },
            },
        };
        const data = await HotelService.findHotelById(body.hotel);
        const duration =
            (new Date(body.check_out).getTime() -
                new Date(body.check_in).getTime()) /
            (1000 * 60 * 60 * 24);
        const hotel_amount =
            data.price.discount_type === 'flat'
                ? data.price.amount - data.price.discount
                : (data.price.amount * data.price.discount) / 100;
        let service_charge: number = 0;
        if (body?.services) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            for (const service of body?.services) {
                const data = await ServiceService.findServiceById(service);
                service_charge += data.price;
            }
        }
        const select = {
            _id: 0,
        };
        const hotel_booking = await HotelBookingService.findHotelBookings(
            filter,
            body,
            select,
        );
        if (hotel_booking.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Hotel already booked for this period ! please change check in time name',
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Hotel booking calculation get successfully',
            data: hotel_amount * body.person * duration + service_charge,
        });
    });
    static postHotelsBooking = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        const { user } = res.locals;
        const session = await mongoose.startSession();
        session.startTransaction();
        let data = null;
        try {
            await HotelService.findHotelById(body.hotel);
            const payment = await PaymentService.createPayment(
                {
                    user: user._id,
                    method: body.method,
                    status: 'pending',
                    payment_type: 'hotel',
                    transaction_id: await generateTransactionId('Tx'),
                    amount: body.amount,
                },
                session,
            );
            const booking = await HotelBookingService.createHotelBooking(
                {
                    booking_id: await generateBookingId('b-'),
                    check_in: new Date(body.check_in),
                    check_out: new Date(body.check_out),
                    person: body.person,
                    services: body.services,
                    hotel: body.hotel,
                    amount: body.amount,
                    status: 'pending',
                    user: user._id,
                    payment: payment._id,
                },
                session,
            );
            const payload = {
                amount: body.amount,
                payment_type: 'hotel',
                booking_id: booking[0]._id.toString(),
            } as TPaymentMethodPayload;
            if (body.method == 'stripe') {
                data = await executeStripePayment(payload);
            } else if (body.method == 'paypal') {
                data = await executePaypalPayment(payload);
            } else if (body.method == 'razorpay') {
                data = await executeRazorpayPayment(payload);
            } else {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Payment method doesn't exist! please try again",
                );
            }
            await session.commitTransaction();
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message:
                    'Your booking request has been received. Please allow some time for processing.',
                data: data,
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    });
    static getHotelsBooking = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        const filter: any = {};
        if (user.role == 'user') {
            filter['user'] = new ObjectId(user._id);
        }
        if (query.status) {
            filter['status'] = query.status;
        }
        if (query._id) {
            const data = await HotelBookingService.findHotelBookingById(
                query._id,
            );
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'Hotel booking get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList =
            await HotelBookingService.findHotelBookingsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Hotel booking List get successfully',
            data: dataList,
        });
    });
    static getHotelsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                { [`name.${langCode}`]: { $regex: new RegExp(query.search.trim(), 'i') } },
                { room_type: { $regex: new RegExp(query.search.trim(), 'i') } },
                {
                    hotel_type: {
                        $regex: new RegExp(query.search.trim(), 'i'),
                    },
                },
            ];
        }
        if (query._id) {
            const data = await HotelService.findHotelById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Hotel get successfully',
                data: {
                    ...data,
                    current_price:
                        data.price.discount_type == 'flat'
                            ? data.price.amount - data.price.discount
                            : data.price.amount -
                              (data.price.amount * data.price.discount) / 100,
                    regular_price: data.price.amount,
                },
            });
        }
        const select = {
            is_deleted: 0,
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await HotelService.findHotelsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Hotels list get successfully',
            data: dataList,
        });
    });
    static getHotelsByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                {
                    [`name.${langCode}`]: {
                        $regex: new RegExp(query.search.trim(), 'i'),
                    },
                },
                { tour_type: { $regex: new RegExp(query.search.trim(), 'i') } },
                { room_type: { $regex: new RegExp(query.search.trim(), 'i') } },
            ];
        }
        if (query.maxPrice && query.minPrice) {
            filter['$and'] = [
                {
                    current_price: {
                        $lte: parseFloat(query.maxPrice),
                    },
                },
                {
                    current_price: {
                        $gte: parseFloat(query.minPrice),
                    },
                },
            ];
        }
        if (query.destination) {
            filter['destination._id'] = new ObjectId(query.destination);
        }

        if (query.room_type) {
            filter['room_type'] = {
                $in: query.room_type.includes(',')
                    ? query.room_type.split(',')
                    : [query.room_type],
            };
        }
        if (query.hotel_type) {
            filter['hotel_type'] = {
                $in: query.hotel_type.includes(',')
                    ? query.hotel_type.split(',')
                    : [query.hotel_type],
            };
        }
        if (query.review) {
            filter['reviews_count'] = +query.review;
        }
        if (query.star) {
            filter['star'] = +query.star;
        }
        if (query._id) {
            const data = await HotelService.findHotelById(query._id);
            const filterReview: any = { status: true };
            const filterReviewCalculate: any = { status: true };
            filterReviewCalculate[`hotel`] = new mongoose.Types.ObjectId(
                data._id,
            );
            filterReview[`hotel._id`] = new mongoose.Types.ObjectId(data._id);
            const selectReviewCalculate = {};
            const select = {
                __v: 0,
                package: 0,
                updatedAt: 0,
                status: 0,
                location: 0,
                service: 0,
                amenities: 0,
                price: 0,
                room: 0,
            };
            const defaultRatingCalculate = {
                location: 0,
                service: 0,
                amenities: 0,
                price: 0,
                room: 0,
                rating_one: 0,
                rating_two: 0,
                rating_three: 0,
                rating_four: 0,
                rating_five: 0,
                rating: 0,
            };
            const review_calculation =
                await ReviewService.findReviewPackageWithCalculation(
                    filterReviewCalculate,
                    query,
                    selectReviewCalculate,
                );

            const reviewList =
                await ReviewService.findReviewHotelsWithPagination(
                    filterReview,
                    query,
                    select,
                );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Package get successfully',
                data: {
                    ...data,
                    current_price:
                        data.price.discount_type == 'flat'
                            ? data.price.amount - data.price.discount
                            : data.price.amount -
                              (data.price.amount * data.price.discount) / 100,
                    review: reviewList.docs,
                    review_calculation: !review_calculation
                        ? defaultRatingCalculate
                        : review_calculation,
                },
            });
        }
        const select = {
            banner_image: 0,
            images: 0,
            banner_video_url: 0,
            group_size: 0,
            is_deleted: 0,
            updatedAt: 0,
            tour_type: 0,
            itinerary_about: 0,
            status: 0,
            itinerary: 0,
            exclude: 0,
            include: 0,
            activities: 0,
            // price:0,
            package_reviews: 0,
            check_out: 0,
            check_in: 0,
            highlight: 0,
            about: 0,
            __v: 0,
        };
        const dataList = await HotelService.findHotelsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Hotel list get successfully',
            data: dataList,
        });
    });
    static getHotelsForSidebar = catchAsync(async (req, res) => {
        const dataList = await HotelService.findHotelsForSidebar();
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Hotel sidebar list get successfully',
            data: dataList,
        });
    });
    static updateHotels = catchAsync(async (req, res) => {
        const { body } = req.body;
        await HotelService.findHotelById(body._id);
        await HotelService.updateHotel({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Hotel updated successfully',
            data: undefined,
        });
    });
    static updateHotelsBookingByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        console.log(body);
        await HotelBookingService.findHotelBookingById(body._id);
        await HotelBookingService.updateHotelBooking({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Hotel booking updated successfully',
            data: undefined,
        });
    });
    static deleteHotels = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await HotelService.findHotelById(id);
        const deletedData = data.images;
        deletedData.push(data.banner_image);
        deletedData.push(data.card_image);
        await deleteFiles(deletedData);
        await HotelService.deleteHotelById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Hotel deleted successfully',
            data: undefined,
        });
    });
}
