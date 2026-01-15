import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const schema = new Schema<TPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        payment_type: {
            type: String,
            enum: ['hotel', 'package', 'product'],
            default: 'event',
        },
        method: {
            type: String,
            enum: ['razorpay', 'stripe', 'paypal'],
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
        },
        transaction_id: String,
        invoice: String,
        amount: Number,
    },
    { timestamps: true },
);

const Payment = model<TPayment>('payment', schema);
export default Payment;
