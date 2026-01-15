import { ClientSession, Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import Package from './hotel-booking.model';
import PackageBooking from './hotel-booking.model';
import HotelBooking from './hotel-booking.model';

export class HotelBookingService {
    static async createHotelBooking(payload: any, session?: ClientSession) {
        const data = await HotelBooking.create([payload], { session });
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create hotel booking. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findHotelBookingById(_id: Types.ObjectId | string) {
        const data = await HotelBooking.findById(_id)
            .select('-updatedAt -__v')
            .populate({ path: 'user', select: 'name image email' })
            .populate({
                path: 'hotel',
                select: 'name card_image section price star room_type hotel_type limit banner_image',
            })
            .populate({
                path: 'payment',
                select: 'payment_type method status transaction_id amount',
            })
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Hotel booking not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findHotelBookingByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await HotelBooking.findOne(query)
            .select('-updatedAt -__v')
            .populate({ path: 'user', select: 'name image email' })
            .populate({ path: 'payment' });
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Hotel booking not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findHotelBookings(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const data = await HotelBooking.aggregate([
            {
                $match: filter,
            },
            {
                $project: select,
            },
        ]);

        return data;
    }
    static async findHotelBookingsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number| any>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = HotelBooking.aggregate([
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
                    from: 'hotels',
                    let: { hotel: '$hotel' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$hotel'],
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
                    as: 'hotel',
                },
            },
            ...(query.search? [
                {
                    $match: {
                        $or: [
                            { [`hotel.name.${query.longCode || "en"}`]: { $regex: new RegExp(query.search, 'i') } },
                            { 'booking_id': { $regex: new RegExp(query.search, 'i') } }
                        ],
                    },
                }
            ]:[]),
            {
                $unwind: {
                    path: '$hotel',
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
        return await HotelBooking.aggregatePaginate(aggregate, options);
    }
    static async updateHotelBooking(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await HotelBooking.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).populate("payment").populate("user").lean();
        return data;
    }

    static async deleteHotelBookingById(_id: string | Types.ObjectId) {
        const data = await HotelBooking.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to delete hotel booking. Please try again.',
            );
        }
        return data;
    }
}
