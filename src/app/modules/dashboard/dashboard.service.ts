import Package from '../package/package.model';
import Hotel from '../hotel/hotel.model';
import Visa from '../visa/visa.model';
import User from '../user/user.model';
import PackageBooking from '../package-booking/package-booking.model';
import Payment from '../payment/payment.model';

export class DashboardService {
    static async getALlFilter() {
        const package_destination = await Package.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $lookup: {
                    from: 'destinations',
                    localField: 'destination',
                    foreignField: '_id',
                    as: 'destinations',
                },
            },
            {
                $unwind: {
                    path: '$destinations',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$destinations._id',
                    name: { $first: '$destinations.name' },
                    address: { $first: '$destinations.address' },
                },
            },
        ]);
        const package_tour_type = await Package.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$tour_type',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        const hotel_destination = await Hotel.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $lookup: {
                    from: 'destinations',
                    localField: 'destination',
                    foreignField: '_id',
                    as: 'destinations',
                },
            },
            {
                $unwind: {
                    path: '$destinations',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$destinations._id',
                    name: { $first: '$destinations.name' },
                    address: { $first: '$destinations.address' },
                },
            },
        ]);
        const hotel_type = await Hotel.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$hotel_type',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        const hotel_room_type = await Hotel.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$room_type',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        const hotel_reputation = await Hotel.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$star',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        const visa_type = await Visa.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $lookup: {
                    from: 'visa_types',
                    localField: 'visa_type',
                    foreignField: '_id',
                    as: 'visa_type',
                },
            },
            {
                $unwind: {
                    path: '$visa_type',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$visa_type._id',
                    name: {
                        $first: '$visa_type.name',
                    },
                },
            },
        ]);
        const visa_mode = await Visa.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$visa_mode',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        const visa_country = await Visa.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$country',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        const visa_validity = await Visa.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: '$validity',
                },
            },
            {
                $project: {
                    name: '$_id',
                    _id: 0,
                },
            },
        ]);
        return [
            {
                key: 'package_destination',
                values: package_destination,
            },
            {
                key: 'package_tour_type',
                values: package_tour_type,
            },
            {
                key: 'hotel_destination',
                values: hotel_destination,
            },
            {
                key: 'hotel_type',
                values: hotel_type,
            },
            {
                key: 'hotel_room_type',
                values: hotel_room_type,
            },
            {
                key: 'hotel_reputation',
                values: hotel_reputation,
            },
            {
                key: 'visa_type',
                values: visa_type,
            },
            {
                key: 'visa_mode',
                values: visa_mode,
            },
            {
                key: 'visa_country',
                values: visa_country,
            },
            {
                key: 'visa_validity',
                values: visa_validity,
            },
        ];
    }
    static async findDashboard() {
        const aggrigate = await User.aggregate([
            {
                $group: {
                    _id: null,
                },
            },
            {
                $lookup: {
                    from: 'visas',
                    pipeline: [{ $match: { status: true } }],
                    as: 'visa',
                },
            },
            {
                $addFields: {
                    visa: {
                        $size: '$visa',
                    },
                },
            },
            {
                $lookup: {
                    from: 'payments',
                    pipeline: [
                        {
                            $match: {
                                status: 'paid',
                                createdAt: {
                                    $gte: new Date(
                                        new Date().setFullYear(
                                            new Date().getFullYear() - 1,
                                        ),
                                    ),
                                },
                            },
                        },
                    ],
                    as: 'payment',
                },
            },
            {
                $addFields: {
                    product: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$payment',
                                        as: 'item',
                                        cond: {
                                            $eq: [
                                                '$$item.payment_type',
                                                'product',
                                            ],
                                        },
                                    },
                                },
                                as: 'filtered_item',
                                in: '$$filtered_item.amount',
                            },
                        },
                    },
                    package: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$payment',
                                        as: 'item',
                                        cond: {
                                            $eq: [
                                                '$$item.payment_type',
                                                'package',
                                            ],
                                        },
                                    },
                                },
                                as: 'filtered_item',
                                in: '$$filtered_item.amount',
                            },
                        },
                    },
                    hotel: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$payment',
                                        as: 'item',
                                        cond: {
                                            $eq: [
                                                '$$item.payment_type',
                                                'hotel',
                                            ],
                                        },
                                    },
                                },
                                as: 'filtered_item',
                                in: '$$filtered_item.amount',
                            },
                        },
                    },
                },
            },
        ]);
        const payment = await Payment.aggregate([
            {
                $match: {
                    status: 'paid',
                    createdAt: {
                        $gte: new Date(
                            new Date().setFullYear(
                                new Date().getFullYear() - 1,
                            ),
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        payment_type: "$payment_type",
                        month: { $month: '$createdAt' },
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const destrination = await PackageBooking.aggregate([
            {
                $lookup: {
                    from: 'packages',
                    localField: 'package',
                    foreignField: '_id',
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
                $lookup: {
                    from: 'destinations',
                    localField: 'package.destination',
                    foreignField: '_id',
                    as: 'package.destination',
                },
            },
            {
                $unwind: {
                    path: '$package.destination',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$package.destination.capital',
                    values: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    names: {
                        $push: '$_id',
                    },
                    values: {
                        $push: '$values',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);
        const paymentTypes = ['package', 'hotel', 'product'];
        const monthLabels = Array.from({ length: 12 }, (_, i) => i + 1);
        const formattedPayment = paymentTypes.map((type) => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            data: monthLabels.map((month) => {
                const found = payment.find((item:any) => item._id.payment_type === type && item._id.month === month);
                return found ? found.totalAmount : 0;
            }),
        }));
        aggrigate[0].payment = formattedPayment
        aggrigate[0].destrination = destrination[0];
        return aggrigate[0];
    }
    static async findDashboardByUser(user: any) {
        const aggrigate = await User.aggregate([
            {
                $group: {
                    _id: null,
                },
            },
            {
                $lookup: {
                    from: 'visa_inqueries',
                    pipeline: [
                        {
                            $match: {
                                email: user.email,
                            },
                        },
                    ],
                    as: 'visa_inquery',
                },
            },
            {
                $addFields: {
                    visa_inquery: {
                        $size: '$visa_inquery',
                    },
                },
            },
            {
                $lookup: {
                    from: 'orders',
                    pipeline: [
                        {
                            $match: {
                                user: user._id,
                                status:{
                                    $in:["accepted" , "completed" , "confirmed"]
                                },
                            },
                        },
                    ],
                    as: 'product_booking',
                },
            },
            {
                $lookup: {
                    from: 'hotel_bookings',
                    pipeline: [
                        {
                            $match: {
                                user: user._id,
                            },
                        },
                    ],
                    as: 'hotel_booking',
                },
            },
            {
                $lookup: {
                    from: 'package_bookings',
                    pipeline: [
                        {
                            $match: {
                                user: user._id,
                            },
                        },
                    ],
                    as: 'package_booking',
                },
            },
            {
                $addFields: {
                    product_booking: { $size: '$product_booking' },
                    package_booking: { $size: '$package_booking' },
                    hotel_booking: { $size: '$hotel_booking' },
                },
            },
            {
                $project: {
                    payment: 0,
                },
            },
        ]);
        return aggrigate;
    }
}
