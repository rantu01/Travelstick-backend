import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TVisaType } from './visa-type.interface';
const schema = new Schema<TVisaType>(
    {
        name: {
            type: Schema.Types.Map,
            of: String,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
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

const VisaType = model<TVisaType>('visa_type', schema);

export default VisaType;
