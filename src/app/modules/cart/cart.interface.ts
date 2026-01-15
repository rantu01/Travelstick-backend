import { Types } from 'mongoose';

export type ICart = {
    user: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
};
