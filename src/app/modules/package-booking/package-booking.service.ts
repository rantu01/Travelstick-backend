import { ClientSession, Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Package from './package-booking.model';
import PackageBooking from './package-booking.model';

export class PackageBookingService {
    static async createPackageBooking(payload: any, session?: ClientSession) {
        const data = await PackageBooking.create([payload], { session });
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create package booking. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findPackageBookingById(_id: Types.ObjectId | string) {
        const data = await PackageBooking.findById(_id)
            .select('-updatedAt -__v')
            .populate({ path: 'user', select: 'name image email' })
            .populate({ path: 'package', select: 'name banner_image' })
            .populate({ path: 'payment' })
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Package booking not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findPackageBookingByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await PackageBooking.findOne(query)
            .select('-updatedAt -__v')
            .populate({ path: 'user', select: 'name image email' })
            .populate({ path: 'payment' });
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Package booking not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findPackageBookingsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = PackageBooking.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'users',
                    let: { user: '$user' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$$user', '$_id'],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                role: 1,
                                image: 1,
                                email: 1,
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
                $lookup: {
                    from: 'payments',
                    let: { payment: '$payment' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$payment'],
                                },
                            },
                        },
                        {
                            $project: {
                                method: 1,
                                status: 1,
                                payment_type: 1,
                                transaction_id: 1,
                                invoice: 1,
                                amount: 1,
                            },
                        },
                    ],
                    as: 'payment',
                },
            },
            {
                $unwind: {
                    path: '$payment',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'services',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                title: 1,
                                price: 1,
                            },
                        },
                    ],
                    as: 'services',
                },
            },
            {
                $lookup: {
                    from: 'packages',
                    let: { package: '$package' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$package'],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                card_image: 1,
                                section: 1,
                                price: {
                                    amount: 1,
                                    discount_type: 1,
                                    discount: 1,
                                },
                            },
                        },
                    ],
                    as: 'package',
                },
            },
            {
                $unwind: {
                    path: '$package',
                    preserveNullAndEmptyArrays: true,
                },
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
        return await PackageBooking.aggregatePaginate(aggregate, options);
    }
    static async updatePackageBooking(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await PackageBooking.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).populate("payment").populate("user").lean();
        return data;
    }

    static async deletePackageBookingById(_id: string | Types.ObjectId) {
        const data = await PackageBooking.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to delete package.',
            );
        }
        return data;
    }
}
