import { Types } from 'mongoose';

export type THotel = {
    name: Map<string, string>;
    banner_image: string;
    card_image: string;
    images: string[];
    banner_video_url: string;
    star: number;
    hotel_type: string;
    room_type: string;
    limit: number;
    price: {
        amount: number;
        discount_type: 'flat' | 'percent';
        discount: number;
    };
    about: Map<string, string>;
    highlight: Map<string, string>[];
    include: Map<string, string>[];
    exclude: Map<string, string>[];
    status: boolean;
    destination: Types.ObjectId;
    mapLink?: string;
    distance_from_city?: number;
    neighborhood?: string;
    meal_plans?: string[];
    reservation_policies?: string[];
    refundability?: 'refundable' | 'non_refundable';
    facilities_services?: string[];
    card_badges?: string[];
    card_room_label?: string;
    card_room_details?: string;
};
