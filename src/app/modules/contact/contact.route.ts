import { Router } from 'express';
import validate from '../../middleware/validate';
import { ContactValidations } from './contact.validation';
import { ContactController } from './contact.controller';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/send',
    validate(ContactValidations.postContactValidationSchema),
    ContactController.createContact,
);

router.post(
    '/send-email',
    auth('admin'),
    validate(ContactValidations.postContactEmailValidationSchema),
    ContactController.sendContactEmailForUser,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('contact_view'),
    ContactController.getContactListByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('contact_view'),
    ContactController.deleteContactByAdmin,
);
router.patch(
    '/reply',
    auth('admin', 'employee'),
    validate(ContactValidations.postContactReplayValidationSchema),
    ContactController.sendReplay,
);

export const contactRoutes: Router = router;
