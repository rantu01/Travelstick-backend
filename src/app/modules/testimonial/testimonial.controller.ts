import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import mongoose from 'mongoose';
import { TestimonialService } from './testimonial.service';

export class TestimonialController {
    static postTestimonials = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const data = await TestimonialService.findTestimonialByUser(
            user._id,
            false,
        );
        if (data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'You have already submitted a review.',
            );
        }
        await TestimonialService.createTestimonial({
            ...body,
            user: user._id,
        });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message:
                'Review submitted successfully. Thank you for your feedback!',
            data: undefined,
        });
    });
    static getTestimonialsByAdminAndUser = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const { user } = res.locals;
        if (query.search) {
            filter['user.name'] = { $regex: new RegExp(query.search, 'i') };
        }
        if (user.role === 'user') {
            filter['user._id'] = new mongoose.Types.ObjectId(user._id);
        }
        if (query._id) {
            const data = await TestimonialService.findTestimonialById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Testimonial get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList =
            await TestimonialService.findTestimonialsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Testimonial list get successfully',
            data: dataList,
        });
    });
    static getReviewsByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };

        if (query._id) {
            const data = await TestimonialService.findTestimonialById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Testimonial get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            status: 0,
        };
        const dataList =
            await TestimonialService.findTestimonialsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review list get successfully',
            data: dataList,
        });
    });
    static updateReviews = catchAsync(async (req, res) => {
        const { body } = req.body;
        await TestimonialService.findTestimonialById(body._id);
        await TestimonialService.updateTestimonial({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review updated successfully',
            data: undefined,
        });
    });
    static deleteReviews = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { user } = res.locals;
        const review = await TestimonialService.findTestimonialById(id);
        if (
            user.role === 'user' &&
            review.user._id.toString() != user._id.toString()
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'You can only modify your own reviews.',
            );
        }

        await TestimonialService.deleteTestimonialById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Testimonial  deleted successfully',
            data: undefined,
        });
    });
}
