import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { CustomTourRequestController } from './custom-tour-request.controller';
import { CustomTourRequestValidation } from './custom-tour-request.validation';

const router = Router();

router.post(
  '/',
  validate(CustomTourRequestValidation.createCustomTourRequestValidation),
  CustomTourRequestController.createCustomTourRequest,
);

router.get(
  '/',
  auth('admin', 'employee'),
  employeePermission('package_view'),
  CustomTourRequestController.getAllCustomTourRequests,
);

router.put(
  '/:id',
  auth('admin', 'employee'),
  employeePermission('package_edit'),
  validate(CustomTourRequestValidation.updateCustomTourRequestValidation),
  CustomTourRequestController.updateCustomTourRequest,
);

router.delete(
  '/:id',
  auth('admin', 'employee'),
  employeePermission('package_delete'),
  CustomTourRequestController.deleteCustomTourRequest,
);

export const customTourRequestRoutes: Router = router;
