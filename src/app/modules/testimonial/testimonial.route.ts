import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { TestimonialValidations } from './testimonial.validation';
import { TestimonialController } from './testimonial.controller';
const router = Router();
router.post(
    '/',
    auth('user', 'admin', 'employee'),
    employeePermission('review_create'),
    validate(TestimonialValidations.postTestimonialValidationSchema),
    TestimonialController.postTestimonials,
);
router.get(
    '/',
    auth('admin', 'employee', 'user'),
    employeePermission('review_view'),
    TestimonialController.getTestimonialsByAdminAndUser,
);
router.get('/site', TestimonialController.getReviewsByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('review_edit'),
    validate(TestimonialValidations.updateTestimonialValidationSchema),
    TestimonialController.updateReviews,
);
router.delete(
    '/:id',
    auth('admin', 'employee', 'user'),
    employeePermission('review_delete'),
    TestimonialController.deleteReviews,
);
export const testimonialRoutes: Router = router;
