import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TFaq } from './faq.interface';
const schema = new Schema<TFaq>(
    {
        question: {
            type: Schema.Types.Map,
            of: String,
            unique: [true, 'Question already exists'],
        },
        answer: {
            type: Schema.Types.Map,
            of: String,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Faq = model<TFaq>('faq', schema);
export default Faq;
