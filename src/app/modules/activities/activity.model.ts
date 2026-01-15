import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TActivity } from './activity.interface';

const schema = new Schema<TActivity>(
    {
        name: {
            type: Schema.Types.Map,
            as: String,
            required: [true, 'Name is required'],
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
const Activity = model<TActivity>('activity', schema);
export default Activity;
