import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { BlogTagValidations } from './blog-tag.validation';
import { BlogTagController } from './blog-tag.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_create'),
    validate(BlogTagValidations.postBlogTagValidationSchema),
    BlogTagController.postBlogTags,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_view'),
    BlogTagController.getBlogTagsByAdmin,
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('blog_edit'),
    validate(BlogTagValidations.updateBlogTagValidationSchema),
    BlogTagController.updateBlogTags,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('blog__delete'),
    BlogTagController.deleteBlogTags,
);
export const tagRoutes: Router = router;
