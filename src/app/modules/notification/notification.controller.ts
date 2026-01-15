import httpStatus  from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';
import { Types } from 'mongoose';

export class NotificationController {
    static findNotifications = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        let data = null;
        const filter: any = {
            'user': new Types.ObjectId(user._id)
        };
        if (query._id) {
            data = await NotificationService.findNotificationById(query._id);
        } else {
            const select = {
                __v: 0,
                updatedAt: 0,
            };
            data = await NotificationService.findNotificationsWithPagination(
                filter,
                query,
                select,
            );
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `Get notification ${!query?._id ? 'list' : ''} Successfully`,
            data,
        });
    });
    static updateNotification = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const notification = await NotificationService.findNotificationById(body._id);
        if (!notification.user._id.equals(user._id)) {
           throw new AppError(
               httpStatus.FORBIDDEN,
               'Request failed',
               'You are not allowed to update this notification',
           );
       }

        const update = await NotificationService.updateNotification({_id: body._id}, body);
        // console.log(update);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Successfully updated notification',
            data: undefined,
        });
    });
    static updateAllNotification = catchAsync(async (req, res) => {
        const { user } = res.locals;
        // console.log(user._id);


        await NotificationService.markAllNotificationsAsRead({ user: user._id });


        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Successfully updated notification',
            data: undefined,
        });
    });

    static deleteNotification = catchAsync(async (req, res) => {
        const { _id } = req.params;
        const user = res.locals.user;
        await NotificationService.deleteNotification(_id, user._id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Successfully deleted notification',
            data: undefined,
        });
    });
}
