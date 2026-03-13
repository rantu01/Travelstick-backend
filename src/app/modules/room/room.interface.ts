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
    meal_plan?: string;
    refundability?: 'refundable' | 'non_refundable';
    images: string[];
    bed_type: string;
    size: string; // e.g., "20 m²"
    status: boolean;
    total_rooms: number; // total physical rooms of this type
};
