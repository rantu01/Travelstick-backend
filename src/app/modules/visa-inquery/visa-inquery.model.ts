import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TVisaInquery } from './visa-inquery.interface';
const schema = new Schema<TVisaInquery>(
    {
        full_name: {
            type: String,
            index: true,
        },
        email: String,
        phone: String,
        visa_type: {
            type: Schema.Types.ObjectId,
            ref: 'visa_type',
        },
        message: String,
        file: String,
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const VisaInquery = model<TVisaInquery>('visa_inquery', schema);

export default VisaInquery;
