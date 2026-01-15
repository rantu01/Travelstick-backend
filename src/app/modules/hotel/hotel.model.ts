import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { THotel } from './hotel.interface';
const schema = new Schema<THotel>(
    {
        name: {
            type: Schema.Types.Map,
            as: String,
            unique: [
                true,
                'hotel name already exists! Please change hotel name and try again',
            ],
            required: [true, 'Hotel name is required'],
        },
        banner_image: String,
        card_image: String,
        images: {
            type: [String],
            default: undefined,
        },
        banner_video_url: String,
        star: {
            type: Number,
            max: [5, 'star must be less than or equal 5'],
            min: [1, 'star must be greater than or equal 1'],
            default: 1,
        },
        room_type: {
            type: String,
            default: undefined,
        },
        hotel_type: {
            type: String,
            default: undefined,
        },
        limit: {
            type: Number,
            default: 0,
        },
        price: {
            amount: Number,
            discount_type: {
                type: String,
                enum: {
                    values: ['flat', 'percent'],
                    message: '{VALUE} is not valid discount type',
                },
            },
            discount: {
                type: Number,
                default: 0,
            },
        },
        about: {
            type: Schema.Types.Map,
            of: String,
        },
        highlight: [
            {
                type: Schema.Types.Map,
                of: String,
            },
        ],
        include: [
            {
                type: Schema.Types.Map,
                of: String,
            },
        ],
        exclude: [
            {
                type: Schema.Types.Map,
                of: String,
            },
        ],
        status: {
            type: Boolean,
            default: true,
        },
        destination: {
            type: Schema.Types.ObjectId,
            ref: 'destination',
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Hotel = model<THotel>('hotel', schema);
export default Hotel;
