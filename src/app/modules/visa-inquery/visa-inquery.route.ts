import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { VisaInqueryValidations } from './visa-inquery.validation';
import { VisaInqueryController } from './visa-inquery.controller';

const router = Router();
router.post(
    '/',
    validate(VisaInqueryValidations.postVisaInqueryValidationSchema),
    VisaInqueryController.postVisaInqueries,
);
router.get(
    '/',
    auth('admin', 'employee', 'user'),
    employeePermission('visa_view'),
    VisaInqueryController.getVisaInquery,
);

router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('visa_delete'),
    VisaInqueryController.deleteVisaTypes,
);

router.post(
    '/apply',
    validate(VisaInqueryValidations.postVisaApplyValidationSchema),
    VisaInqueryController.postVisaApply,
);

export const visaInqueryRoutes: Router = router;
