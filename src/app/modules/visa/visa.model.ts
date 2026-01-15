import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TVisa } from './visa.interface';
const schema = new Schema<TVisa>(
    {
        title: {
            type: Schema.Types.Map,
            as: String,
            unique: [
                true,
                'visa title already exists! Please change visa title and try again',
            ],
            required: [true, 'Visa title is required'],
        },
        banner_image: String,
        card_image: String,
        images: {
            type: [String],
            default: undefined,
        },
        visa_type: {
            type: Schema.Types.ObjectId,
            ref: 'visa_type',
        },
        language: String,
        validity: String,
        processing_type: String,
        visa_mode: String,
        country: String,
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
        overview: {
            type: Schema.Types.Map,
            of: String,
        },
        documents: {
            type: [
                {
                    key: {
                        type: Schema.Types.Map,
                        of: String,
                    },
                    value: {
                        type: Schema.Types.Map,
                        of: String,
                    },
                },
            ],
            default: undefined,
        },
        document_about: {
            type: Schema.Types.Map,
            of: String,
        },
        feathers: [
            {
                logo: String,
                text: {
                    type: Schema.Types.Map,
                    of: String,
                },
            },
        ],
        faqs: [
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
const Visa = model<TVisa>('visa', schema);
export default Visa;
