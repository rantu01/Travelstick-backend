import { model, Schema } from 'mongoose';
import { TAdvertisement } from './advertisement.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TAdvertisement>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            required: [true, 'Title must be required'],
        },
        type: {
            type: String,
        },
        status: {
            type: String,
            enum: ['public', 'private'],
        },
        image: {
            type: String,
        },
        redirect_url: {
            type: String,
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);

const Advertisement = model<TAdvertisement, any>('advertisement', schema);
export default Advertisement;
