import { Types } from 'mongoose';

export type TOrder = {
    order_id: string;
    products: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    amount: number;
    status: 'pending' | 'completed' | 'accepted' | 'cancelled';
    delivery_charge: number;
    payment: Types.ObjectId;
    user: Types.ObjectId;
};
