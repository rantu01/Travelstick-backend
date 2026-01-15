import { Types } from 'mongoose';

export type TNotification = {
    title: string;
    message: string;
    type: string;
    data: object;
    status: 'sent' | 'scheduled' | 'failed';
    scheduled_date: Date;
    is_read: boolean;
    user: Types.ObjectId;
};
