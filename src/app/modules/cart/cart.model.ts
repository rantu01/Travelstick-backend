import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { ICart } from './cart.interface';
const schema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
        },
        quantity: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const Cart = model<ICart>('cart', schema);

export default Cart;
