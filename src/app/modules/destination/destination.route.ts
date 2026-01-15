import { Router } from 'express';
import validate from '../../middleware/validate';
import { DestinationValidations } from './destination.validation';
import { DestinationController } from './destination.controller';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('destination_create'),
    validate(DestinationValidations.postDestinationValidationSchema),
    DestinationController.postDestinations,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('destination_view'),
    DestinationController.getDestinationsByAdmin,
);
router.get('/site', DestinationController.getDestinationsByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('destination_edit'),
    DestinationController.updateDestinations,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('destination_delete'),
    DestinationController.deleteDestinations,
);

export const destinationRoutes: Router = router;
