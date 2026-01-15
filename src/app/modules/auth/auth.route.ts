import { Router } from 'express';
import validate from '../../middleware/validate';
import { AuthValidations } from './auth.validation';
import { AuthController } from './auth.controller';
import { USER_ROLE_ENUM } from '../../utils/constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
    '/login',
    validate(AuthValidations.userLoginValidationSchema),
    AuthController.loginAccess,
);

router.post(
    '/verify-with-google',
    validate(AuthValidations.googleProviderValidationSchema),
    AuthController.googleLoginAccess,
);
router.post('/refresh-token', AuthController.refreshToken);
router.post(
    '/forget-password/verify-otp',
    validate(AuthValidations.forgetPasswordOtpVerify),
    AuthController.forgetPasswordOTPVerify,
);
router.post(
    '/forget-password/submit',
    auth(...USER_ROLE_ENUM),
    validate(AuthValidations.forgetPasswordValidationSchema),
    AuthController.forgetPasswordSubmitTokenBased,
);
router.patch(
    '/password-update',
    validate(AuthValidations.passwordUpdateValidationSchema),
    auth(...USER_ROLE_ENUM),
    AuthController.userPasswordUpdate,
);
export const authRoutes: Router = router;
