import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TPackageBooking } from './package-booking.interface';
const schema = new Schema<TPackageBooking>(
    {
        booking_id: {
            type: String,
            index: true,
            required: [true, 'booking_id is required'],
        },
        check_in: {
            type: Date,
            required: [true, 'check_in is required'],
        },
        check_out: {
            type: Date,
            required: [true, 'check_out is required'],
        },
        person: {
            type: Number,
            default: 0,
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: 'service',
            },
        ],
        amount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'confirmed', 'cancelled', 'completed'],
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'user is required'],
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'payment',
            required: [true, 'payment is required'],
        },

        package: {
            type: Schema.Types.ObjectId,
            required: [true, 'package is required'],
            ref: 'package',
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const PackageBooking = model<TPackageBooking>('package_booking', schema);
export default PackageBooking;
