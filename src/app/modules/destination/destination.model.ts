import { model, Schema } from 'mongoose';
import { TDestination } from './destination.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TDestination>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        short_description: {
            type: Schema.Types.Map,
            of: String,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
        },
        card_image: String,
        banner_image: String,
        images: {
            type: [String],
            default: undefined,
        },
        video_url: String,
        capital: String,
        language: String,
        currency: String,
        address: {
            name: String,
            lat: Number,
            lng: Number,
        },
        location: {
            type: {
                type: String,
                enum: {
                    values: ['Point'],
                    message: 'Type must be a Point',
                },
                default: 'Point',
            },
            coordinates: [Number],
        },
        status: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Destination = model<TDestination>('destination', schema);
export default Destination;
