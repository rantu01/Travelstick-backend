import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { CartController } from './cart.controller';
import { CartValidations } from './cart.validation';

const router = Router();

router.post(
    '/',
    auth('user'),
    validate(CartValidations.postCartValidationSchema),
    CartController.postCarts,
);
router.get('/', auth('user'), CartController.getCartsByUser);
router.get('/calculate', auth('user'), CartController.getCartsCalculate);
router.delete('/:product', auth('user'), CartController.deleteCarts);
export const cartRoutes: Router = router;
