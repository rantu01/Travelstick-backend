import { Router } from 'express';
import validate from '../../middleware/validate';
import { ProviderValidations } from './provider.validation';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ProviderController } from './provider.controller';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('provider_create'),
    validate(ProviderValidations.postProviderValidationSchema),
    ProviderController.postProviders,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('provider_view'),
    ProviderController.getProvidersByAdmin,
);
router.get('/site', ProviderController.getProvidersByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('provider_edit'),
    validate(ProviderValidations.updateProviderValidationSchema),
    ProviderController.updateProviders,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('provider_delete'),
    ProviderController.deleteProviders,
);

export const providerRoutes: Router = router;
