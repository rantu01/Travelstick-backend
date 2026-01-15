import { z } from 'zod';
import mongoose from 'mongoose';
const postVisaInqueryValidationSchema = z.object({
    body: z.object({
        full_name: z
            .string({
                invalid_type_error: 'full_name must be string',
                required_error: 'full_name is required',
            })
            .min(1, {
                message: 'full_name is required',
            })
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
        visa_type: z
            .string({
                required_error: 'visa_type is required',
                invalid_type_error: 'visa_type must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'visa_type must be valid objectID',
            }),
        message: z
            .string({
                required_error: 'message is required',
                invalid_type_error: 'message must be string',
            })
            .max(255, {
                message: 'message should be less then  255 character',
            }),
    }),
});

export const VisaInqueryValidations = {
    postVisaInqueryValidationSchema,
};
