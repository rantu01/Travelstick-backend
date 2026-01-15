import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ProductCategoryValidations } from './product-category.validation';
import { ProductCategoryController } from './product-category.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_create'),
    validate(ProductCategoryValidations.postProductCategoryValidationSchema),
    ProductCategoryController.createProductCategory,
);
router.get('/', ProductCategoryController.getCategoryListByAdmin);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_edit'),
    validate(ProductCategoryValidations.updateProductCategoryValidationSchema),
    ProductCategoryController.updateProductCategoryByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('product_delete'),
    ProductCategoryController.deleteProductCategoryByAdmin,
);
export const productCategoryRoutes: Router = router;
