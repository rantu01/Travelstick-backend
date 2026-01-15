import { Types } from 'mongoose';
export type TReplay = {
    user: Types.ObjectId;
    package_review: Types.ObjectId;
    comment: string;
};
