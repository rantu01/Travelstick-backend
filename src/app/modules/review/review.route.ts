import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ReviewPackageValidations } from './review.validation';
import { ReviewController } from './review.controller';
const router = Router();
router.post(
    '/',
    auth('user'),
    validate(ReviewPackageValidations.postReviewValidationSchema),
    ReviewController.postReviewPackages,
);
router.post(
    '/replay',
    auth('user'),
    validate(ReviewPackageValidations.postReplayValidationSchema),
    ReviewController.postReplays,
);
router.get(
    '/package',
    auth('admin', 'employee'),
    employeePermission('review_view'),
    ReviewController.getReviewPackagesByAdmin,
);

router.get(
    '/hotel',
    auth('admin', 'employee'),
    employeePermission('review_view'),
    ReviewController.getReviewHotelsByAdmin,
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('review_edit'),
    validate(ReviewPackageValidations.updateReviewValidationSchema),
    ReviewController.updateReviewPackages,
);
router.delete(
    '/:id',
    auth('admin', 'employee', 'user'),
    employeePermission('review_delete'),
    ReviewController.deleteReviewPackages,
);
export const reviewRoutes: Router = router;
