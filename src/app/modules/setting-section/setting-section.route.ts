import { Router } from 'express';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { SettingSectionController } from './setting-section.controller';
import validate from '../../middleware/validate';
import { SettingSessionValidations } from './setting-section.validation';
const router = Router();
router.patch(
    '/',
    auth('admin', 'employee'),
    employeePermission('setting_edit'),
    validate(SettingSessionValidations.updateSessionValidationSchema),
    SettingSectionController.updateSectionsBYAdmin,
);
router.get('/', SettingSectionController.getSections);

export const sectionRoutes: Router = router;
