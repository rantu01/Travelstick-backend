import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { BlogValidations } from './blog.validation';
import { BlogController } from './blog.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_create'),
    validate(BlogValidations.postBlogValidationSchema),
    BlogController.postBlogs,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_view'),
    BlogController.getBlogsByAdmin,
);
router.get('/site', BlogController.getBlogsByPublic);
router.get('/categories', BlogController.getBlogCategoriesByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_edit'),
    validate(BlogValidations.updateBlogValidationSchema),
    BlogController.updateBlogsByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('blog_delete'),
    BlogController.deleteBlogsByAdmin,
);
export const blogRoutes: Router = router;
