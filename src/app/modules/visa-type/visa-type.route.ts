import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { VisaTypeController } from './visa-type.controller';
import { VisaTypeValidations } from './visa-type.validation';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('visa_create'),
    validate(VisaTypeValidations.postVisaTypeValidationSchema),
    VisaTypeController.postVisaTypes,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('visa_view'),
    VisaTypeController.getVisaTypesByAdmin,
);
router.get('/site', VisaTypeController.getVisaTypesByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('visa_edit'),
    validate(VisaTypeValidations.updateVisaTypeValidationSchema),
    VisaTypeController.updateVisaTypes,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('visa_delete'),
    VisaTypeController.deleteVisaTypes,
);
export const visaTypeRoutes: Router = router;
