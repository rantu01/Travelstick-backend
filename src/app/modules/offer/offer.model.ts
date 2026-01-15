import { model, Schema } from 'mongoose';
import { TOffer } from './offer.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TOffer>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            required: [true, 'Title must be required'],
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        offer_type: {
            type: String,
            enum: {
                values: ['weakly', 'monthly', 'yearly'],
                message: '{VALUE} is not supported',
            },
        },
        image: String,
        discount_type: {
            type: String,
            enum: {
                values: ['flat', 'percent'],
            },
        },
        discount: {
            type: Number,
            default: 0,
        },
        expireAt: Date,
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);
schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
schema.plugin(aggregatePaginate);
const Offer = model<TOffer>('offer', schema);
export default Offer;
