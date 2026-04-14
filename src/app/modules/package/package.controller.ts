import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { PackageService } from './package.service';
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

const sanitizePackagePayload = (payload: any) => {
    if (!payload || typeof payload !== 'object') return {};

    const includes = payload.includes ?? payload.include;
    const excludes = payload.excludes ?? payload.exclude;

    const allowed = {
        name: payload.name,
        banner_image: payload.banner_image,
        card_image: payload.card_image,
        images: payload.images,
        banner_video_url: payload.banner_video_url,
        destination: payload.destination,
        section: payload.section,
        price: payload.price,
        check_in: payload.check_in,
        check_out: payload.check_out,
        available_dates: payload.available_dates,
        group_size: payload.group_size,
        tour_type: payload.tour_type,
        start_location: payload.start_location,
        end_location: payload.end_location,
        difficulty_level: payload.difficulty_level,
        transport_type: payload.transport_type,
        min_age: payload.min_age,
        accommodation_type: payload.accommodation_type,
        meals_included: payload.meals_included,
        about: payload.about,
        activities: payload.activities,
        highlight: payload.highlight,
        includes,
        excludes,
        policies: payload.policies ?? payload.policy,
        feathers: payload.feathers,
        itinerary_about: payload.itinerary_about,
        itinerary: payload.itinerary,
        status: payload.status,
    };

    return Object.fromEntries(
        Object.entries(allowed).filter(([, value]) => value !== undefined),
    );
};

const toDateKey = (value: Date | string) => {
    const date = new Date(value);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
        2,
        '0',
    )}-${String(date.getUTCDate()).padStart(2, '0')}`;
};

const isSelectedDateAllowed = (
    selectedDate: string,
    availableDates: Date[] = [],
) => {
    if (!availableDates.length) return true;
    const selectedKey = toDateKey(selectedDate);
    return availableDates.some((date) => toDateKey(date) === selectedKey);
};

const normalizeAvailableDates = (availableDates: string[] = []) => {
    if (!Array.isArray(availableDates) || !availableDates.length) return [];

    const uniqueDates = new Set<string>();
    for (const date of availableDates) {
        uniqueDates.add(toDateKey(date));
    }

    return Array.from(uniqueDates)
        .sort()
        .map((date) => new Date(date));
};

export class PackageController {
    static postPackages = catchAsync(async (req, res) => {
        const body = sanitizePackagePayload(req.body?.body);
        if (Array.isArray(body?.available_dates)) {
            body.available_dates = normalizeAvailableDates(body.available_dates);
        }
        const data = await PackageService.findPackageByQuery(
            {
                name: body.name,
            },
            false,
        );
        if (data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Package already exists ! please change package name',
            );
        }
        await PackageService.createPackage(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Package created successfully',
            data: undefined,
        });
    });
    static postPackageBookingCalculation = catchAsync(async (req, res) => {
        const { body } = req.body;
        const package_data = await PackageService.findPackageById(body.package);

        if (package_data?.available_dates?.length) {
            if (!body?.date) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed !',
                    'Booking date is required for this package.',
                );
            }

            if (
                !isSelectedDateAllowed(body.date, package_data.available_dates)
            ) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed !',
                    'Selected date is not available for this package.',
                );
            }
        }

        const package_amount =
            package_data.price.discount_type === 'flat'
                ? package_data.price.amount - package_data.price.discount
                : package_data.price.amount  - ((package_data.price.amount * package_data.price.discount) /
                  100);
        let service_charge: number = 0;
        if (body?.services) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            for (const service of body?.services) {
                const data = await ServiceService.findServiceById(service);
                service_charge += data.price;
            }
        }
        if (body.person > package_data.group_size) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Selected number of persons exceeds the package limit.',
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package booking calculation get successfully',
            data: package_amount * body.person + service_charge,
        });
    });
    static postPackageBooking = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        const { user } = res.locals;
        const session = await mongoose.startSession();
        session.startTransaction();
        let data = null;
        try {
            const package_data = await PackageService.findPackageById(
                body.package,
            );

            if (package_data?.available_dates?.length) {
                if (!body?.date) {
                    throw new AppError(
                        httpStatus.BAD_REQUEST,
                        'Request Failed !',
                        'Booking date is required for this package.',
                    );
                }

                if (
                    !isSelectedDateAllowed(
                        body.date,
                        package_data.available_dates,
                    )
                ) {
                    throw new AppError(
                        httpStatus.BAD_REQUEST,
                        'Request Failed !',
                        'Selected date is not available for this package.',
                    );
                }
            }

            const selectedCheckIn = body?.date
                ? new Date(body.date)
                : new Date(package_data.check_in);
            const packageDurationMs =
                new Date(package_data.check_out).getTime() -
                new Date(package_data.check_in).getTime();
            const selectedCheckOut = body?.date
                ? new Date(selectedCheckIn.getTime() + Math.max(packageDurationMs, 0))
                : new Date(package_data.check_out);

            const payment = await PaymentService.createPayment(
                {
                    user: user._id,
                    method: body.method,
                    status: 'pending',
                    payment_type: 'package',
                    transaction_id: await generateTransactionId('Tx'),
                    amount: body.amount,
                },
                session,
            );
            const booking = await PackageBookingService.createPackageBooking(
                {
                    booking_id: await generateBookingId('b-'),
                    check_in: selectedCheckIn,
                    check_out: selectedCheckOut,
                    person: body.person,
                    services: body.services,
                    package: body.package,
                    amount: body.amount,
                    status: 'pending',
                    user: user._id,
                    payment: payment._id,
                },
                session,
            );
            const payload = {
                amount: body.amount,
                payment_type: 'package',
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
    static getPackageBooking = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        const filter: any = {};
        if (user.role == 'user') {
            filter['user'] = new ObjectId(user._id);
        }
        if (query.status) {
            filter['status'] = query.status;
        }
        if (query.search) {
            filter[`$or`] = [
                {
                    booking_id: {
                        $regex: new RegExp(query.search.trim(), 'i'),
                    },
                },
            ];
        }
        if (query._id) {
            const data = await PackageBookingService.findPackageBookingById(
                query._id,
            );
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'Get package booking successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList =
            await PackageBookingService.findPackageBookingsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Get package booking List successfully',
            data: dataList,
        });
    });
    static getPackagesByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter[`$or`] = [
                { name: { $regex: new RegExp(query.search.trim(), 'i') } },
                { tour_type: { $regex: new RegExp(query.search.trim(), 'i') } },
            ];
        }
        if (query._id) {
            const data = await PackageService.findPackageById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Package get successfully',
                data,
            });
        }
        const select = {
            is_deleted: 0,
            updatedAt: 0,
            activities: 0,
            __v: 0,
        };
        const dataList = await PackageService.findPackagesWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Packages list get successfully',
            data: dataList,
        });
    });
    static getPackagesByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        if (query.search) {
            filter[`$or`] = [
                { name: { $regex: new RegExp(query.search.trim(), 'i') } },
                { tour_type: { $regex: new RegExp(query.search.trim(), 'i') } },
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
        if (query.activities) {
            const newActivities = [];
            if (!query.activities.includes(',')) {
                newActivities.push(new ObjectId(query.activities));
            } else {
                query.activities.split(',').forEach((item: any) => {
                    newActivities.push(new ObjectId(item));
                });
            }
            filter['activities'] = { $in: newActivities };
        }
        if (query.section) {
            filter['section'] = { $in: [query.section] };
        }
        if (query.tour_type) {
            filter['tour_type'] = query.tour_type;
        }
        if (query.check_in) {
            filter['check_in'] = new Date(query.check_in);
        }
        if (query.duration) {
            filter['duration'] = {
                $gte: +query.duration,
            };
        }
        if (query.review) {
            filter['rounded_review'] = +query.review;
        }

        if (query.discount_type) {
            filter['price.discount_type'] = query.discount_type;
        }
        if (query.discount) {
            filter['price.discount'] = +query.discount;
        }

        if (query._id) {
            const data = await PackageService.findPackageById(query._id);
            const filterReview: any = {
                status: true,
                ['package._id']: new mongoose.Types.ObjectId(data._id),
            };
            const filterReviewCalculate: any = {
                status: true,
                package: new mongoose.Types.ObjectId(data._id),
            };

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
                    {},
                );

            const dataList =
                await ReviewService.findReviewPackagesWithPagination(
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
                    review: dataList.docs,
                    duration: Math.max(
                        1,
                        Math.ceil(
                            (new Date(data.check_out).getTime() -
                                new Date(data.check_in).getTime()) /
                                (1000 * 60 * 60 * 24),
                        ),
                    ),
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
            is_deleted: 0,
            updatedAt: 0,
            room_type: 0,
            hotel_type: 0,
            status: 0,
            excludes: 0,
            includes: 0,
            rounded_review: 0,
            // price:0,
            package_reviews: 0,
            highlight: 0,
            about: 0,
            __v: 0,
        };
        const dataList = await PackageService.findPackagesWithPagination(
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
    static getPackagesForSidebar = catchAsync(async (req, res) => {
        const dataList = await PackageService.findPackagesForSidebar();
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Packages sidebar list get successfully',
            data: dataList,
        });
    });
    static updatePackages = catchAsync(async (req, res) => {
        const rawBody = req.body?.body || {};
        if (!rawBody?._id) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Package id is required for update.',
            );
        }

        const body = sanitizePackagePayload(rawBody);
        if (Array.isArray(body?.available_dates)) {
            body.available_dates = normalizeAvailableDates(body.available_dates);
        }
        await PackageService.findPackageById(rawBody._id);
        await PackageService.updatePackage({ _id: rawBody._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Packages updated successfully',
            data: undefined,
        });
    });
    static updatePackageBooking = catchAsync(async (req, res) => {
        const { body } = req.body;
        await PackageBookingService.findPackageBookingById(body._id);
        await PackageBookingService.updatePackageBooking(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Packages booking updated successfully',
            data: undefined,
        });
    });
    static deletePackages = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await PackageService.findPackageById(id);
        const deletedImage = data.images;
        deletedImage.push(data.banner_image);
        deletedImage.push(data.card_image);
        if (data.feathers)
            data.feathers.forEach((item: any) => deletedImage.push(item?.logo));
        await deleteFiles(deletedImage);
        await PackageService.deletePackageById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Packages deleted successfully',
            data: undefined,
        });
    });
}
