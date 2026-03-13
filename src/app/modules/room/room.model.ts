import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TRoom } from './room.interface';

const schema = new Schema<TRoom>(
    {
        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'hotel',
            required: [true, 'Hotel is required'],
        },
        name: {
            type: Schema.Types.Map,
            of: String,
            required: [true, 'Room name is required'],
        },
        price: {
            amount: { type: Number, required: true },
            discount_type: {
                type: String,
                enum: ['flat', 'percent'],
                default: 'flat',
            },
            discount: { type: Number, default: 0 },
        },
        capacity: {
            adults: { type: Number, default: 2 },
            children: { type: Number, default: 0 },
        },
        amenities: [String],
        meal_plan: {
            type: String,
            default: undefined,
        },
        refundability: {
            type: String,
            enum: ['refundable', 'non_refundable'],
            default: undefined,
        },
        images: [String],
        bed_type: String,
        size: String,
        status: { type: Boolean, default: true },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Room = model<TRoom>('room', schema);
export default Room;
