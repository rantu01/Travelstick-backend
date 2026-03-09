import { Types } from 'mongoose';

export type TVisa = {
    title: Map<string, string>;
    banner_image: string;
    card_image: string;
    images: string[];
    visa_type: Types.ObjectId;
    language: string;
    validity: string;
    processing_type: string;
    visa_mode: string;
    country: string;
    price: {
        amount: number;
        discount_type: 'flat' | 'percent';
        discount: number;
    };
    overview: Map<string, string>;
    documents: { key: Map<string, string>; value: Map<string, string> }[];
    document_about: Map<string, string>;
    continent: Map<string, string>;
    capital: Map<string, string>;
    official_language: Map<string, string>;
    currency: Map<string, string>;
    local_time: Map<string, string>;
    exchange_rate: Map<string, string>;
    dialing_code: string;
    weekend_days: Map<string, string>;
    population: Map<string, string>;
    area: Map<string, string>;
    education: Map<string, string>;
    religion: Map<string, string>;
    embassy_address: Map<string, string>;
    apply_fee: number;
    feathers: {
        logo: string;
        text: Map<string, string>;
    }[];
    faqs: {
        heading: Map<string, string>;
        description: Map<string, string>;
    }[];
    status: boolean;
};

