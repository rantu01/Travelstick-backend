import { Types } from 'mongoose';

export type TTestimonial = {
    user: Types.ObjectId;
    status: boolean;
    rating: number;
    comment: string | undefined;
};
