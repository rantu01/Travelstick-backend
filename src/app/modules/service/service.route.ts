import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ServiceValidations } from './service.validation';
import { ServiceController } from './service.controller';
const router = Router();
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_view'),
    ServiceController.getServicesByAdmin,
);
router.get('/site', ServiceController.getServicesByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_edit'),
    validate(ServiceValidations.updateServiceValidationSchema),
    ServiceController.updateServices,
);
export const serviceRoutes: Router = router;
