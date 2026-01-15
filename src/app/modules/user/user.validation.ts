import { z } from 'zod';
import mongoose from 'mongoose';

const registerValidationSchema = z.object({
    body: z.object({
        otp: z
            .string({
                invalid_type_error: 'OTP must be string',
                required_error: 'OTP is required',
            })
            .min(1, {
                message: 'OTP is required',
            })
            .trim(),
        name: z
            .string({
                invalid_type_error: 'User name must be string',
                required_error: 'User name is required',
            })
            .min(1, {
                message: 'User name is required',
            })
            .max(50, {
                message: 'Name must be less than or equal to 50 characters',
            })
            .trim(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required',
            })
            .email({ message: 'Invalid email address' })
            .trim(),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required',
            })
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            })
            .trim(),
        fcm_token: z
            .string({
                invalid_type_error: 'fcm_token must be string',
            })
            .optional(),
    }),
});
const postEmployeeValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'User name must be string',
                required_error: 'User name is required',
            })
            .min(1, {
                message: 'User name is required',
            })
            .max(50, {
                message: 'Name must be less than or equal to 50 characters',
            })
            .trim(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required',
            })
            .email({ message: 'Invalid email address' })
            .trim(),
        phone: z.string({
            invalid_type_error: 'Phone must be string',
            required_error: 'Phone is required',
        }),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required',
            })
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            })
            .trim(),
        role: z
            .string({
                invalid_type_error: 'User employee role must be string',
                required_error: 'User employee role is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'User employee role is invalid',
            }),
    }),
});
const updateUserProfileValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'User name must be string',
                required_error: 'User name is required',
            })
            .max(50, {
                message: 'Name must be less than or equal to 50 characters',
            })
            .optional(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required',
            })
            .email({ message: 'Invalid email address' })
            .optional(),
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required',
            })
            .optional(),
        image: z
            .string({
                invalid_type_error: 'image must be string',
            })
            .optional(),
        country: z
            .string({
                invalid_type_error: 'Country must be string',
                required_error: 'Country is required',
            })
            .max(250, {
                message: 'Country must be less than or equal to 250 characters',
            })
            .optional(),
        city: z
            .string({
                invalid_type_error: 'City must be string',
                required_error: 'City is required',
            })
            .optional(),
        state: z
            .string({
                invalid_type_error: 'User statue must be string',
                required_error: 'User statue must be string',
            })
            .max(50, {
                message: 'State must be less than or equal to 50 characters',
            })
            .optional(),

        zip_code: z
            .string({
                invalid_type_error: 'User zip code must be string',
                required_error: 'User zip code is required',
            })
            .optional(),
        address: z
            .string({
                invalid_type_error: 'User address must be string',
                required_error: 'User address is required',
            })
            .max(250, {
                message: 'Country must be less than or equal to 250 characters',
            })
            .optional(),
    }),
});
const updatePasswordValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'User _id must be string',
                required_error: 'User _id must be required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id must be required',
            }),
        password: z
            .string({
                invalid_type_error: 'Password must be string',
                required_error: 'Password is required',
            })
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
        confirm_password: z
            .string({
                invalid_type_error: 'Confirm password must be string',
                required_error: 'Confirm password is required',
            })
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            }),
    }),
});
const updateEmployeeValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Employee id must be string',
                required_error: 'Employee id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Employee id is invalid',
            }),
        name: z
            .string({
                invalid_type_error: 'User name must be string',
                required_error: 'User name is required',
            })
            .max(50, {
                message: 'Name must be less than or equal to 50 characters',
            })
            .trim()
            .optional(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required',
            })
            .email({ message: 'Invalid email address' })
            .trim()
            .optional(),
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required',
            })
            .optional(),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required',
            })
            .min(6, {
                message:
                    'Password must be greater than or equal to 6 characters',
            })
            .max(100, {
                message:
                    'Password must be less than or equal to 100 characters',
            })
            .trim()
            .optional(),
        role: z
            .string({
                invalid_type_error: 'User employee role must be string',
                required_error: 'User employee role is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'User employee role is invalid',
            })
            .optional(),
    }),
});
export const UserValidations = {
    registerValidationSchema,
    updateUserProfileValidationSchema,
    postEmployeeValidationSchema,
    updatePasswordValidationSchema,
    updateEmployeeValidationSchema,
};
