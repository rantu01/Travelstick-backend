import { Types } from 'mongoose';

export type TAccessTokanPayload = {
    _id: Types.ObjectId | undefined;
    uid: string | undefined;
    role: string;
    name: string;
    phone: string | undefined;
    email: string | undefined;
};

export type TTokenPayload = {
    _id: Types.ObjectId | undefined;
    name: string;
    email: string | undefined;
    phone: string | undefined;
    role: string;
};
