import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { THotelBooking } from './hotel-booking.interface';

const schema = new Schema<THotelBooking>(
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
        hotel: {
            type: Schema.Types.ObjectId,
            required: [true, 'hotel is required'],
            ref: 'hotel',
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const HotelBooking = model<THotelBooking>('hotel_booking', schema);
export default HotelBooking;
