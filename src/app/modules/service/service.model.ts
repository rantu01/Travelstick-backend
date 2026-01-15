import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TService } from './service.interface';

const schema = new Schema<TService>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            index: true,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        module: {
            type: String,
            enum: ['package', 'room'],
            default: 'package',
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Service = model<TService>('service', schema);
export default Service;
