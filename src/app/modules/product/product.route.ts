import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ProductValidations } from './product.validation';
import { ProductController } from './product.controller';
const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_create'),
    validate(ProductValidations.postProductValidationSchema),
    ProductController.postProducts,
);

router.post(
    '/order',
    auth('user'),
    validate(ProductValidations.postProductPaymentSchema),
    ProductController.postProductsOrder,
);

router.get(
    '/order',
    auth('admin', 'user', 'employee'),
    employeePermission('product_view'),
    ProductController.getProductOrders,
);
router.patch(
    '/order',
    auth('admin', 'employee'),
    employeePermission('order_edit'),
    validate(ProductValidations.updateProductOrderSchema),
    ProductController.updateProductOrders,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_view'),
    ProductController.getProductsByAdmin,
);
router.get('/site', ProductController.getProductsByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_edit'),
    validate(ProductValidations.updateProductValidationSchema),
    ProductController.updateProducts,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('product_delete'),
    ProductController.deleteProducts,
);
export const productRoutes: Router = router;
