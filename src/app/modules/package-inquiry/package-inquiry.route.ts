import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { PackageInquiryValidations } from './package-inquiry.validation';
import { PackageInquiryController } from './package-inquiry.controller';

const router = Router();

router.post(
    '/',
    validate(PackageInquiryValidations.postPackageInquiryValidationSchema),
    PackageInquiryController.postPackageInquiry,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_view'),
    PackageInquiryController.getPackageInquiry,
);

router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('package_delete'),
    PackageInquiryController.deletePackageInquiry,
);

export const packageInquiryRoutes: Router = router;
