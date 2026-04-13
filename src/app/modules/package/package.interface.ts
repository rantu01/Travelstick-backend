import { Types } from 'mongoose';

export type TPackage = {
    name: Map<string, string>;
    banner_image: string;
    card_image: string;
    images: string[];
    banner_video_url: string;
    destination: Types.ObjectId;
    section: string[];
    price: {
        amount: number;
        discount_type: 'flat' | 'percent';
        discount: number;
    };
    check_out: Date;
    check_in: Date;
    group_size: number;
    tour_type: string;
    start_location: string;
    end_location: string;
    difficulty_level: 'easy' | 'moderate' | 'hard';
    transport_type: string;
    min_age: number;
    accommodation_type: string;
    meals_included: string;
    about: Map<string, string>;
    activities: Types.ObjectId[];
    highlight: Map<string, string>[];
    includes: Map<string, string>[];
    excludes: Map<string, string>[];
    policies: Map<string, string>[];
    feathers: {
        logo: string;
        text: Map<string, string>;
    }[];
    itinerary_about: Map<string, string>;
    itinerary: {
        heading: Map<string, string>;
        description: Map<string, string>;
    }[];
    status: boolean;
};
