import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import { PackageValidations } from './package.validation';
import { PackageController } from './package.controller';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_create'),
    validate(PackageValidations.postPackageValidationSchema),
    PackageController.postPackages,
);
router.post(
    '/booking/calculate',
    validate(PackageValidations.postPackageBookingCalculationValidationSchema),
    PackageController.postPackageBookingCalculation,
);
router.post(
    '/booking',
    auth('user'),
    validate(PackageValidations.postPackageBookingValidationSchema),
    PackageController.postPackageBooking,
);
router.get(
    '/booking',
    auth('user', 'admin', 'employee'),
    employeePermission('package_view'),
    PackageController.getPackageBooking,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_view'),
    PackageController.getPackagesByAdmin,
);
router.get('/sidebar', PackageController.getPackagesForSidebar);
router.get('/site', PackageController.getPackagesByPublic);

router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_edit'),
    PackageController.updatePackages,
);
router.patch(
    '/booking',
    auth('admin', 'employee'),
    employeePermission('package_edit'),
    validate(PackageValidations.updatePackageBookingValidationSchema),
    PackageController.updatePackageBooking,
);

router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('package_delete'),
    PackageController.deletePackages,
);

export const packageRoutes: Router = router;
