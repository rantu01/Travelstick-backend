import { Router } from 'express';
import auth from '../../middleware/auth';
import { NotificationController } from './notification.controller';
import { NotificationValidations } from './notification.validation';
import validate from '../../middleware/validate';

const routes = Router();

routes.get(
    '/',
    auth('user', 'admin'),
    NotificationController.findNotifications,
);
routes.patch(
    '/',
    auth('user', 'admin'),
    validate(NotificationValidations.updateNotificationValidationSchema),
    NotificationController.updateNotification,
);
routes.get(
    '/all',
    auth('user', 'admin'),
    NotificationController.updateAllNotification,
);
routes.delete(
    '/:_id',
    auth('user', 'admin'),
    NotificationController.deleteNotification,
);

export const notificationRoutes: Router = routes;
