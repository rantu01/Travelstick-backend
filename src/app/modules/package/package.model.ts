import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TPackage } from './package.interface';
const schema = new Schema<TPackage>(
    {
        name: {
            type: Schema.Types.Map,
            as: String,
            unique: [
                true,
                'package already exists! Please change package name and try again',
            ],
            required: [true, 'Name is required'],
        },
        banner_image: String,
        card_image: String,
        images: {
            type: [String],
            default: undefined,
        },
        banner_video_url: String,
        destination: {
            type: Schema.Types.ObjectId,
            ref: 'destination',
        },
        section: {
            type: [String],
            default: [],
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
        check_out: {
            type: Date,
            required: [true, 'chack_out is required'],
        },
        check_in: {
            type: Date,
            required: [true, 'check_in is required'],
        },
        group_size: {
            type: Number,
            default: 0,
        },
        tour_type: String,
        about: {
            type: Schema.Types.Map,
            of: String,
        },
        activities: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'activity',
                },
            ],
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
        feathers: [
            {
                logo: String,
                text: {
                    type: Schema.Types.Map,
                    of: String,
                },
            },
        ],
        itinerary_about: {
            type: Schema.Types.Map,
            of: String,
        },
        itinerary: [
            {
                heading: {
                    type: Schema.Types.Map,
                    of: String,
                },
                description: {
                    type: Schema.Types.Map,
                    of: String,
                },
            },
        ],
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Package = model<TPackage>('package', schema);
export default Package;
