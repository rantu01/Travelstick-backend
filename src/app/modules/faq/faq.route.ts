import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { FaqValidations } from './faq.validation';
import { FaqController } from './faq.controller';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('faq_create'),
    validate(FaqValidations.postFaqValidationSchema),
    FaqController.createFaq,
);
router.get('/', FaqController.getFaqs);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('faq_edit'),
    validate(FaqValidations.updateFaqValidationSchema),
    FaqController.updateFaqsByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('faq_delete'),
    employeePermission('faq_delete'),
    FaqController.deleteFaqsByAdmin,
);

export const faqRoutes: Router = router;
