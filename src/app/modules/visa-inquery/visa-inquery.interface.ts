import { Types } from 'mongoose';
export type TVisaInquery = {
    full_name: string;
    email: string;
    phone: string;
    visa_type: Types.ObjectId;
    message: string;
    file: string;
    // ── Apply fields ──
    visa: Types.ObjectId;
    appointment_date: Date;
    number_of_applicants: number;
    price_per_person: number;
    total_price: number;
    inquiry_type: 'inquiry' | 'apply'; // কোন tab থেকে এসেছে বোঝার জন্য
};
