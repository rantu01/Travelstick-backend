import { Router } from 'express';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import validate from '../../middleware/validate';
import { SubscriberValidations } from './subscriber.validation';
import { SubscriberController } from './subscriber.controller';
const router = Router();
router.post(
    '/',
    validate(SubscriberValidations.postSubscriberValidationSchema),
    SubscriberController.createSubscriber,
);
router.post(
    '/send-email',
    validate(SubscriberValidations.sendEmailSubscriberValidationSchema),
    SubscriberController.sendEmailByAdmin,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('subscriber_view'),
    SubscriberController.getSubscriberListByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('subscriber_delete'),
    SubscriberController.deleteSubscriberByAdmin,
);

export const subscriberRoutes: Router = router;
