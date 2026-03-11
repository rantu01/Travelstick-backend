import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import { UmrahInquiryValidation } from './umrah-inquiry.validation';
import { UmrahInquiryController } from './umrah-inquiry.controller';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

// Public — anyone can submit an inquiry from the frontend form
router.post(
    '/',
    validate(UmrahInquiryValidation.createUmrahInquiryValidation),
    UmrahInquiryController.createUmrahInquiry,
);

// Admin / Employee only
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('umrah_inquiry_view'),
    UmrahInquiryController.getAllUmrahInquiries,
);

router.get(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('umrah_inquiry_view'),
    UmrahInquiryController.getSingleUmrahInquiry,
);

router.put(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('umrah_inquiry_edit'),
    validate(UmrahInquiryValidation.updateUmrahInquiryValidation),
    UmrahInquiryController.updateUmrahInquiry,
);

router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('umrah_inquiry_delete'),
    UmrahInquiryController.deleteUmrahInquiry,
);

export const umrahInquiryRoutes: Router = router;