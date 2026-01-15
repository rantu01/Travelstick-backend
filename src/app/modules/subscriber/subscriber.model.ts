import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TSubscriber } from './subscriber.interface';

const schema = new Schema<TSubscriber>(
    {
        email: String,
    },
    {
        timestamps: true,
    },
);

schema.plugin(aggregatePaginate);

const Subscriber = model<TSubscriber, any>('subscriber', schema);

export default Subscriber;
