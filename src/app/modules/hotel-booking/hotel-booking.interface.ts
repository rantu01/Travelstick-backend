import { Types } from 'mongoose';

export type THotelBooking = {
    booking_id: string;
    check_in: Date;
    check_out: Date;
    person: number;
    services: Types.ObjectId[];
    amount: number;
    status: string;
    user: Types.ObjectId;
    payment: Types.ObjectId;
    hotel: Types.ObjectId;
};
