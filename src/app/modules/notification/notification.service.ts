import { Types } from 'mongoose';
import Notification from './notification.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
export class NotificationService {
    static createNotification = async (payload: any) => {
        return await Notification.create(payload);
    };
    static findNotificationById = async (_id: string | Types.ObjectId) => {
        const role = await Notification.findById(_id).select('-__v').lean();
        if (!role) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Request failed',
                'Failed to find notification ! please check your notification credentials try again',
            );
        }
        return role;
    };

    static findNotificationsWithPagination = async (
        filter: Record<string, string | boolean | Types.ObjectId>,
        query: Record<string, string | boolean | Types.ObjectId>,
        select: Record<string, string | boolean | Types.ObjectId | number>,
    ) => {
        const unsetFields = Object.keys(select).filter(key => select[key] === 0);

        const pipeline = [
            {
                $match: filter,
            },
            ...(unsetFields.length > 0 ? [{ $unset: unsetFields }] : [])
        ];

        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };

        return await Notification.aggregatePaginate(pipeline, options);
    };
    static updateNotification = async (
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) => {
        const options = {
            new: true,
            session,
        };
        return await Notification.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
    };

    static markAllNotificationsAsRead = async (
        query: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) => {
        // console.log("query",query);
        const options = {
            session,
        };

        return await Notification.updateMany(
            query,
            { $set: { is_read: true } },
            options,
        );
    };
    static deleteNotification = async (_id: string | Types.ObjectId, user: string | Types.ObjectId) => {
        const result = await Notification.deleteOne({ _id, user });

        if (result.deletedCount === 0) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Request failed',
                'Failed to delete notification ! please check your notification credentials try again',
            );
        }

        return;
    };
}
