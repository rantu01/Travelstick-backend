import { model, Schema } from 'mongoose';
import { TGiftCard } from './gift-card.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TGiftCard>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            required: [true, 'Title must be required'],
        },
        subtitle: {
            type: Schema.Types.Map,
            of: String,
        },
        code: String,
        image: String,
        price: {
            type: Number,
            default: 0,
        },
        applicable_service: String,
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const GiftCard = model<TGiftCard>('giftcard', schema);
export default GiftCard;
