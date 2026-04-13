import { Types } from 'mongoose';

export type TPackageInquiry = {
    package: Types.ObjectId;
    full_name: string;
    email: string;
    phone: string;
    message: string;
};
