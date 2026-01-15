import { Types } from 'mongoose';
export type TVisaInquery = {
    full_name: string;
    email: string;
    phone: string;
    visa_type: Types.ObjectId;
    message: string;
    file: string;
};
