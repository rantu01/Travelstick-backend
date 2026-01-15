import validate from '../../middleware/validate';
import { UserValidations } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middleware/auth';
import { USER_ROLE_ENUM } from '../../utils/constants';
import { Router } from 'express';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/register',
    validate(UserValidations.registerValidationSchema),
    UserController.registerNewAccount,
);
router.post(
    '/employees',
    auth('admin', 'employee'),
    employeePermission('hrm_create'),
    validate(UserValidations.postEmployeeValidationSchema),
    UserController.postEmployeeProfile,
);

router.get('/profile', auth(...USER_ROLE_ENUM), UserController.getUserProfile);
router.get('/', auth('admin'), UserController.getUserListByAdmin);
router.get(
    '/employees',
    auth('admin', 'employee'),
    employeePermission('hrm_view'),
    UserController.getEmployeeListByAdmin,
);
router.patch(
    '/profile',
    auth(...USER_ROLE_ENUM),
    validate(UserValidations.updateUserProfileValidationSchema),
    UserController.userProfileUpdate,
);
router.put(
    '/employees',
    auth('admin', 'employee'),
    employeePermission('hrm_edit'),
    validate(UserValidations.updateEmployeeValidationSchema),
    UserController.employeeProfileUpdate,
);
router.patch(
    '/password-update',
    auth('admin'),
    validate(UserValidations.updatePasswordValidationSchema),
    UserController.userPasswordUpdate,
);
router.delete('/:id', auth('admin'), UserController.userProfileDeleteBYAdmin);
router.delete(
    '/profile',
    auth(...USER_ROLE_ENUM),
    UserController.userProfileDelete,
);

export const userRoutes: Router = router;
