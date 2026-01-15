import { z } from 'zod';

const userLoginValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string({
                invalid_type_error: 'User identifier must be a string',
                required_error: 'User identifier is required',
            })
            .refine(
                (value) => {
                    return (
                        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
                        z.string().email().safeParse(value).success
                    );
                },
                {
                    message: 'User identifier must be a valid email or phone number',
                },
            ),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required',
            })
            .min(6, {
                message: 'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message: 'Password must be less than or equal to 100 characters',
            })
            .trim(),
        fcm_token: z
            .string({
                invalid_type_error: 'fcm_token must be a string',
            })
            .optional(),
    }),
});

const identifierValidations = z.object({
    body: z.object({
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required',
            })
            .optional(),

        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required',
            })
            .email({
                message: 'Invalid email address',
            })
            .optional(),
    }),
});

const forgetPasswordOtpVerify = z.object({
    body: z.object({
        otp: z.string({
            invalid_type_error: 'Otp must be string',
            required_error: 'Otp is required',
        }),
        identifier: z
            .string({
                invalid_type_error: 'Identifier must be a string',
                required_error: 'Identifier is required',
            })
            .refine(
                (value) => {
                    return (
                        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
                        z.string().email().safeParse(value).success
                    );
                },
                {
                    message: 'Identifier must be a valid email or phone number',
                },
            ),
        action: z.enum(['forget_password', 'signup', 'profile_update'], {
            invalid_type_error: 'Action must be string',
            required_error: 'Action is required',
        }),
    }),
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        password: z
            .string({
                invalid_type_error: 'Password must be string',
                required_error: 'Password is required',
            })
            .min(6, {
                message: 'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message: 'Password must be less than or equal to 100 characters',
            }),
        confirm_password: z
            .string({
                invalid_type_error: 'Confirm password must be string',
                required_error: 'Confirm password is required',
            })
            .min(6, {
                message: 'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message: 'Password must be less than or equal to 100 characters',
            }),
    }),
});

const passwordUpdateValidationSchema = z.object({
    body: z.object({
        old_password: z
            .string({
                invalid_type_error: 'Old password must be string',
                required_error: 'Old password is required',
            })
            .min(6, {
                message: 'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message: 'Password must be less than or equal to 100 characters',
            }),
        password: z
            .string({
                invalid_type_error: 'Password must be string',
                required_error: 'Password is required',
            })
            .min(6, {
                message: 'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message: 'Password must be less than or equal to 100 characters',
            }),
        confirm_password: z
            .string({
                invalid_type_error: 'Confirm password must be string',
                required_error: 'Confirm password is required',
            })
            .min(6, {
                message: 'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message: 'Password must be less than or equal to 100 characters',
            }),
    }),
});

const googleProviderValidationSchema = z.object({
    body: z.object({
        id_token: z.string({
            required_error: 'id_token must be required',
            invalid_type_error: 'it_token must be string',
        }),
        role: z.string({
            required_error: 'Role is required',
            invalid_type_error: 'Role must be string',
        }),
        fcm_token: z
            .string({
                required_error: 'fcm_token must be required',
                invalid_type_error: 'fcm_token must be string',
            })
            .optional(),
    }),
});

export const AuthValidations = {
    userLoginValidationSchema,
    forgetPasswordOtpVerify,
    forgetPasswordValidationSchema,
    identifierValidations,
    passwordUpdateValidationSchema,
    googleProviderValidationSchema,
};