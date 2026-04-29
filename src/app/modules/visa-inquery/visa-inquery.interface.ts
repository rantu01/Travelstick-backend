import { Types } from 'mongoose';

export type TVisaInquery = {
    full_name: string;
    email: string;
    phone: string;
    visa_type?: Types.ObjectId;
    visa_type_name?: string;
    visa_name?: string;
    message?: string;
    file?: string;
    // ── Apply fields ──
    visa?: Types.ObjectId;
    appointment_date?: Date;
    number_of_applicants?: number;
    price_per_person?: number;
    total_price?: number;
    given_name?: string;
    last_name?: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: Date;
    nationality?: string;
    visited_countries?: string;
    passport_number?: string;
    passport_expiry_date?: Date;
    profession?: string;
    local_address?: string;
    foreign_address?: string;
    inquiry_type: 'inquiry' | 'apply'; // কোন tab থেকে এসেছে বোঝার জন্য
};
