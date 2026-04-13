import { z } from 'zod';
import mongoose from 'mongoose';

const postPackageInquiryValidationSchema = z.object({
    body: z.object({
        package: z
            .string({
                required_error: 'package is required',
                invalid_type_error: 'package must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'package must be valid objectID',
            }),
        full_name: z
            .string({
                required_error: 'full_name is required',
                invalid_type_error: 'full_name must be string',
            })
            .min(1, { message: 'full_name is required' })
            .max(255, {
                message:
                    'full_name must be less than or equal to 255 characters',
            })
            .trim(),
        email: z
            .string({
                required_error: 'email is required',
                invalid_type_error: 'email must be string',
            })
            .email({
                message: 'email must be valid email',
            }),
        phone: z.string({
            required_error: 'phone is required',
            invalid_type_error: 'phone must be string',
        }),
        message: z
            .string({
                required_error: 'message is required',
                invalid_type_error: 'message must be string',
            })
            .min(1, {
                message: 'message is required',
            })
            .max(1000, {
                message:
                    'message must be less than or equal to 1000 characters',
            }),
    }),
});

export const PackageInquiryValidations = {
    postPackageInquiryValidationSchema,
};
