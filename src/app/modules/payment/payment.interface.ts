import { Types } from 'mongoose';

export type TPayment = {
    user: Types.ObjectId;
    method: string;
    status: 'pending' | 'completed' | 'failed';
    payment_type: string;
    transaction_id: string;
    invoice?: string;
    amount: number;
};

export type TPaymentMethodPayload = {
    amount: number;
    payment_type: string;
    booking_id: Types.ObjectId | string;
};
