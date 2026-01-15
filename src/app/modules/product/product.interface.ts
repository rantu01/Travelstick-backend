import { Types } from 'mongoose';
export interface TProduct {
    name: string;
    description: Map<string, string>;
    additional_info?: Map<string, any>;
    images?: [string];
    quantity: number;
    price?: {
        amount: number;
        discount?: number;
        discount_type?: string;
    };
    thumb_image?: string;
    status: boolean;
    category: Types.ObjectId;
}
