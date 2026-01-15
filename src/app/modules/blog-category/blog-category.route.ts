import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { BlogCategoryValidations } from './blog-category.validation';
import { BlogCategoryController } from './blog-category.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_create'),
    validate(BlogCategoryValidations.postBlogCategoryValidationSchema),
    BlogCategoryController.postBlogCategories,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_view'),
    BlogCategoryController.getCategoryListByAdmin,
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_edit'),
    validate(BlogCategoryValidations.updateBlogCategoryValidationSchema),
    BlogCategoryController.updateCategoryByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('blog_delete'),
    BlogCategoryController.deleteCategoryByAdmin,
);
export const blogCategoryRoutes: Router = router;
