import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { SettingLanguageValidations } from './setting-language.validation';
import { Router } from 'express';
import { SettingLanguageController } from './setting-language.controller';
import employeePermission from '../../middleware/employeePermission';
import modePermission from '../../middleware/modePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    modePermission(),
    employeePermission('language_create'),
    validate(SettingLanguageValidations.postLanguageSettingValidationSchema),
    SettingLanguageController.postLanguageSetting,
);
router.get('/site', SettingLanguageController.getLanguagesByPublic);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('language_view'),
    SettingLanguageController.getLanguagesByAdmin,
);

router.put(
    '/',
    auth('admin', 'employee'),
    modePermission(),
    employeePermission('language_edit'),
    validate(SettingLanguageValidations.updateLanguageSettingValidationSchema),
    SettingLanguageController.updateLanguageSetting,
);

router.delete(
    '/:_id',
    auth('admin', 'employee'),
    modePermission(),
    employeePermission('language_delete'),
    SettingLanguageController.deleteLanguageSetting,
);

export const languageRoutes: Router = router;
