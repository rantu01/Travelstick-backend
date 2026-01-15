import { model, Schema } from 'mongoose';
import { TProvider } from './provider.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TProvider>(
    {
        name: {
            type: String,
            index: true,
            required: true,
        },
        about: {
            type: Schema.Types.Map,
            of: String,
        },
        specialists: {
            type: [String],
            default: undefined,
        },
        qualifications: {
            type: [String],
            default: undefined,
        },
        personal_info: {
            type: Schema.Types.Map,
            of: String,
        },
        professional_info: {
            type: Schema.Types.Map,
            of: String,
        },
        image: String,
        email: String,
        phone: String,
        x_url: String,
        facebook_url: String,
        instagram_url: String,
        linkedin_url: String,
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Provider = model<TProvider, any>('provider', schema);
export default Provider;
