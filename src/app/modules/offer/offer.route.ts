import { Router } from 'express';
import validate from '../../middleware/validate';
import { OfferValidations } from './offer.validation';
import { OfferController } from './offer.controller';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_create'),
    validate(OfferValidations.postOfferValidationSchema),
    OfferController.postOffers,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_view'),
    OfferController.getOffersByAdmin,
);
router.get('/site', OfferController.getOffersByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_edit'),
    validate(OfferValidations.updateOfferValidationSchema),
    OfferController.updateOffers,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('package_delete'),
    OfferController.deleteOffers,
);

export const offerRoutes: Router = router;
