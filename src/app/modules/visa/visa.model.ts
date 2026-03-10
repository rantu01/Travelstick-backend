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
        citizen_of: String,
        travelling_to: String,
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
        continent: {
            type: Schema.Types.Map,
            of: String,
        },
        capital: {
            type: Schema.Types.Map,
            of: String,
        },
        official_language: {
            type: Schema.Types.Map,
            of: String,
        },
        currency: {
            type: Schema.Types.Map,
            of: String,
        },
        local_time: {
            type: Schema.Types.Map,
            of: String,
        },
        exchange_rate: {
            type: Schema.Types.Map,
            of: String,
        },
        dialing_code: String,
        weekend_days: {
            type: Schema.Types.Map,
            of: String,
        },
        population: {
            type: Schema.Types.Map,
            of: String,
        },
        area: {
            type: Schema.Types.Map,
            of: String,
        },
        education: {
            type: Schema.Types.Map,
            of: String,
        },
        religion: {
            type: Schema.Types.Map,
            of: String,
        },
        embassy_address: {
            type: Schema.Types.Map,
            of: String,
        },
        apply_fee: {
            type: Number,
            default: 0,
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