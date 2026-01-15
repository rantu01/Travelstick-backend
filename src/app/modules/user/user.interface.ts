import { Types } from 'mongoose';
export type TUser = {
    name: string;
    email?: string | undefined | null;
    phone?: string | undefined | null;
    password: string;
    image?: string;
    role: string;
    country?: string;
    city?: string;
    state?: string;
    zip_code: number;
    address?: string;
    about?: string;
    permissions?: Types.ObjectId;
    fcm_token: string[];
    push_notification_status: boolean;
    is_deleted: boolean;
    isModified: (field: string) => boolean;
};

export type TPasswordUpdate = TUser & {
    isModified(path: string): boolean;
};

export type TUserExist = {
    _id: Types.ObjectId | undefined;
    email: string | undefined;
    phone: string | undefined;
};
export type TUserQueryParams = {
    _id?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
};

export interface IUserUpdateParameters {
    query: Record<string, any>;
    updateDocument: never;
    session?: never;
}
