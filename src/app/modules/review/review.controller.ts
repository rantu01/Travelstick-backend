import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import mongoose from 'mongoose';
import { ReviewService } from './review.service';
import ProductReview from './review.model';
import httpStatus from 'http-status';
import { ReplayService } from '../replay/replay.service';

export class ReviewController {
    static postReviewPackages = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        await ReviewService.createReviewPackage({
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
    static postReplays = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        console.log({ user: user._id, ...body });
        await ReplayService.createReplay({ user: user._id, ...body });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Replay send successfully',
            data: undefined,
        });
    });
    static getReviewPackagesByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter['user.name'] = { $regex: new RegExp(query.search, 'i') };
        }
        if (query._id) {
            const data = await ReviewService.findReviewPackageById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Package review get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await ReviewService.findReviewPackagesWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package review list get successfully',
            data: dataList,
        });
    });
    static getReviewHotelsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter['user.name'] = { $regex: new RegExp(query.search, 'i') };
        }
        if (query._id) {
            const data = await ReviewService.findReviewPackageById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Hotel review get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await ReviewService.findReviewHotelsWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Hotel review list get successfully',
            data: dataList,
        });
    });
    static updateReviewPackages = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ReviewService.findReviewPackageById(body._id);
        await ReviewService.updateReviewPackage({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review updated successfully',
            data: undefined,
        });
    });
    static deleteReviewPackages = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ReviewService.findReviewPackageById(id);
        await ReviewService.deleteReviewPackageById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package review deleted successfully',
            data: undefined,
        });
    });
}
