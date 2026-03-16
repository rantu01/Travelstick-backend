import { Router } from 'express';
import validate from '../../middleware/validate';
import { GiftCardValidations } from './gift-card.validation';
import { GiftCardController } from './gift-card.controller';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_create'),
    validate(GiftCardValidations.postGiftCardValidationSchema),
    GiftCardController.postGiftCard,
);

router.get('/', auth('admin', 'employee'), employeePermission('package_view'), GiftCardController.getGiftCardsByAdmin);
router.get('/site', GiftCardController.getGiftCardsByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('package_edit'),
    validate(GiftCardValidations.updateGiftCardValidationSchema),
    GiftCardController.updateGiftCards,
);
router.delete('/:id', auth('admin', 'employee'), employeePermission('package_delete'), GiftCardController.deleteGiftCards);

export const giftCardRoutes: Router = router;
