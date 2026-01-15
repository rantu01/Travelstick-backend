import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import mongoose, { Types } from 'mongoose';
import Testimonial from './testimonial.model';
import { ObjectId } from 'mongodb';

export class TestimonialService {
    static async createTestimonial(payload: any) {
        const data = await Testimonial.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create new testimonial ! please try again',
            );
        }
        return data;
    }
    static async findTestimonialById(_id: string | Types.ObjectId) {
        const data = await Testimonial.findById(_id)
            .populate({
                path: 'user',
                select: 'name image role address country',
            })
            .select('-updatedAt -__v -status');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Testimonial not found. please check your testimonial id and try again',
            );
        }
        return data;
    }
    static async findTestimonialByUser(
        user: string | Types.ObjectId,
        permission: boolean = true,
    ) {
        const data = await Testimonial.findOne({
            user: new ObjectId(user),
        })
            .populate({
                path: 'user',
                select: 'name image role address country',
            })
            .select('-updatedAt -__v -status');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Testimonial not found. please check your testimonial and try again',
            );
        }
        return data;
    }
    static async findTestimonialByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Testimonial.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Testimonial not found. please check your testimonial and try again',
            );
        }
        return data;
    }
    static async findTestimonialsWithPagination(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Testimonial.aggregate([
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1,
                                role: 1,
                                country: 1,
                                address: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: filter,
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Testimonial.aggregatePaginate(aggregate, options);
    }

    static async updateTestimonial(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Testimonial.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Failed to create new testimonial ! please try again',
            );
        }
        return data;
    }
    static async deleteTestimonialById(_id: string | Types.ObjectId) {
        const data =
            await Testimonial.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Testimonial not found. please check your testimonial id and try again',
            );
        }
        return data;
    }
}
