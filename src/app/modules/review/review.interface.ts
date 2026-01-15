import { Types } from 'mongoose';

export type TReviewPackage = {
    location: number;
    service: number;
    amenities: number;
    price: number;
    room: number;
    comment: string | undefined;
    status: boolean;
    user: Types.ObjectId;
    package: Types.ObjectId;
    hotel: Types.ObjectId;
};
