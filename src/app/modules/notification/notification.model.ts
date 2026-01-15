import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TNotification } from './notification.interface';

const schema = new Schema<TNotification>(
    {
        title: {
            type: String,
            required: [true, 'title must be required'],
        },
        message: {
            type: String,
            required: [true, 'body must be required'],
        },
        type: {
            type: String,
            enum: ['reminder', 'hotel', 'order', 'package'],
        },
        data: Schema.Types.Mixed,
        status: {
            type: String,
            enum: {
                values: ['sent', 'scheduled', 'failed'],
                message: '{VALUE} is not supported',
            },
            default: 'sent',
        },
        scheduled_date: {
            type: Date,
            default: undefined,
        },
        is_read: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Notification = model<TNotification, any>('notification', schema);
export default Notification;
