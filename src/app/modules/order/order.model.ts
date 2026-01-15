import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
const schema = new Schema<TOrder>(
    {
        order_id: {
            type: String,
            index: true,
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'product',
                },
                quantity: Number,
            },
        ],
        amount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'accepted', 'cancelled'],
            default: 'pending',
        },
        delivery_charge: {
            type: Number,
            default: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'payment',
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Order = model<TOrder>('order', schema);
export default Order;
