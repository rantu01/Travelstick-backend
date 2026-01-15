import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { AdvertisementValidations } from './advertisement.validation';
import { AdvertisementController } from './advertisement.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('advertisement_create'),
    validate(AdvertisementValidations.postAdvertisementValidationSchema),
    AdvertisementController.postAdvertisement,
);
router.post(
    '/clicks',
    validate(
        AdvertisementValidations.postAdvertisementClickOrImpressionValidationSchema,
    ),
    AdvertisementController.postAdvertisementClick,
);
router.post(
    '/impressions',
    validate(
        AdvertisementValidations.postAdvertisementClickOrImpressionValidationSchema,
    ),
    AdvertisementController.postAdvertisementImpression,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('advertisement_view'),
    AdvertisementController.getAdvertisementBYAdmin,
);
router.get('/site', AdvertisementController.getAdvertisementByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('advertisement_edit'),
    validate(AdvertisementValidations.updateAdvertisementValidationSchema),
    AdvertisementController.updateAdvertisementByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('advertisement_delete'),
    AdvertisementController.deleteAdvertisementByAdmin,
);
export const advertisementRouter: Router = router;
