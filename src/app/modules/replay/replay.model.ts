import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TReplay } from './replay.interface';

const schema = new Schema<TReplay>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        package_review: {
            type: Schema.Types.ObjectId,
            ref: 'package_review',
        },
        comment: String,
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Replay = model<TReplay>('replay', schema);
export default Replay;
