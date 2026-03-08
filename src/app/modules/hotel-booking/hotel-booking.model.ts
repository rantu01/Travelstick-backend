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
        rooms_count: {
            type: Number,
            default: 1,
        },
        adults: {
            type: Number,
            default: 1,
        },
        children: {
            type: Number,
            default: 0,
        },
        with_pets: {
            type: Boolean,
            default: false,
        },
        first_name: {
            type: String,
            required: [true, 'first_name is required'],
        },
        last_name: {
            type: String,
            required: [true, 'last_name is required'],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
        },
        phone: {
            type: String,
            required: [true, 'phone is required'],
        },
        country: {
            type: String,
            required: [true, 'country is required'],
        },
        arrival_time: {
            type: String,
            required: [true, 'arrival_time is required'],
        },
        special_requests: String,
        smoking_preference: {
            type: String,
            enum: ['smoking', 'non-smoking'],
        },
        bed_preference: {
            type: String,
            enum: ['large', 'twin'],
        },
        room_details: [
            {
                room: { type: Schema.Types.ObjectId, ref: 'room' },
                count: Number,
            },
        ],
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
            default: 'pending',
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
