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


const postVisaApplyValidationSchema = z.object({
    body: z.object({
        full_name: z.string().min(1).max(255).trim(),
        email: z.string().email(),
        phone: z.string(),
        visa: z.string().refine((d) => mongoose.Types.ObjectId.isValid(d), {
            message: 'visa must be valid objectID',
        }),
        appointment_date: z.string(),
        number_of_applicants: z.number().positive(),
        price_per_person: z.number().nonnegative(),
        total_price: z.number().nonnegative(),
        inquiry_type: z.literal('apply'),
    }),
});

export const VisaInqueryValidations = {
    postVisaInqueryValidationSchema,
    postVisaApplyValidationSchema,
};
