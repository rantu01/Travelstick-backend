import { Types } from 'mongoose';

export type THotelBooking = {
    booking_id: string;
    check_in: Date;
    check_out: Date;
    person: number;
    rooms_count: number;
    adults: number;
    children: number;
    with_pets: boolean;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    arrival_time: string;
    special_requests?: string;
    smoking_preference?: 'smoking' | 'non-smoking';
    bed_preference?: 'large' | 'twin';
    room_details?: { room: Types.ObjectId; count: number }[];
    services: Types.ObjectId[];
    amount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    user: Types.ObjectId;
    payment: Types.ObjectId;
    hotel: Types.ObjectId;
};
