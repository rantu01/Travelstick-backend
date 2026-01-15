import { Router } from 'express';
import { SettingController } from './setting.controller';
import validate from '../../middleware/validate';
import { SettingValidations } from './setting.validation';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import modePermission from '../../middleware/modePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    modePermission(),
    employeePermission('setting_create'),
    validate(SettingValidations.postSettingValidationSchema),
    SettingController.updateSettings,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('setting_view'),
    SettingController.getSettingsByAdmin,
);
router.get('/env-checks', SettingController.getSettingsEnvCheck);
router.post('/env-creates', SettingController.postSettingsEnvByAdmin);

router.get('/site', SettingController.getSettingsByPublic);

export const settingRoutes: Router = router;
