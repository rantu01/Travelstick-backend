import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import { ActivityValidations } from './activity.validation';
import { ActivityController } from './activity.controller';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_create'),
    validate(ActivityValidations.postActivityValidationSchema),
    ActivityController.postActivities,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_view'),
    ActivityController.getActivitiesByAdmin,
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_edit'),
    ActivityController.updateActivities,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('package_delete'),
    ActivityController.deleteActivities,
);

export const activityRoutes: Router = router;
