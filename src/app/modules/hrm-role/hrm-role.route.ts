import { Router } from 'express';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { HRMRoleValidations } from './hrm-role.validation';
import { RoleController } from './hrm-role.controller';
import employeePermission from '../../middleware/employeePermission';

const routes = Router();

routes.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('hrm_create'),
    validate(HRMRoleValidations.postHRMValidationSchema),
    RoleController.postHRMRoles,
);
routes.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('hrm_view'),
    RoleController.findRoleByAdmin,
);
routes.get(
    '/permissions',
    auth('admin', 'employee'),
    employeePermission('hrm_view'),
    RoleController.findPermissionsByAdmin,
);
routes.patch(
    '/permissions',
    auth('admin', 'employee'),
    employeePermission('hrm_edit'),
    validate(HRMRoleValidations.updateHRMPermissionValidationSchema),
    RoleController.updateHRMPermissions,
);

routes.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('hrm_edit'),
    validate(HRMRoleValidations.updateHRMValidationSchema),
    RoleController.updateHRMRoles,
);
routes.delete(
    '/:_id',
    auth('admin', 'employee'),
    employeePermission('hrm_delete'),
    RoleController.deleteHRMRoles,
);

export const hrmRoleRoutes: Router = routes;
