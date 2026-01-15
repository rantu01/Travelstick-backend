import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import { VisaValidations } from './visa.validation';
import { VisaController } from './visa.controller';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('visa_create'),
    validate(VisaValidations.postVisasValidationSchema),
    VisaController.postVisas,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('visa_view'),
    VisaController.getVisasByAdmin,
);
router.get('/sidebar', VisaController.getVisasForSidebar);
router.get('/site', VisaController.getVisasByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('visa_edit'),
    VisaController.updateVisas,
);

router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('visa_delete'),
    VisaController.deleteVisas,
);

export const visaRoutes: Router = router;
