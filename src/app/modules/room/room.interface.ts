import { Types } from 'mongoose';

export type TRoom = {
    hotel: Types.ObjectId;
    name: Map<string, string>;
    price: {
        amount: number;
        discount_type: 'flat' | 'percent';
        discount: number;
    };
    capacity: {
        adults: number;
        children: number;
    };
    amenities: string[];
    images: string[];
    bed_type: string;
    size: string; // e.g., "20 m²"
    status: boolean;
};
