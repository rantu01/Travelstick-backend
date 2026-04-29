import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdString = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'must be valid objectID',
});

const postVisaInqueryValidationSchema = z.object({
    body: z
        .object({
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
            visa_type: objectIdString.optional(),
            visa: objectIdString.optional(),
            visa_name: z.string().max(255).optional(),
            visa_type_name: z.string().max(255).optional(),
            message: z
                .string({
                    required_error: 'message is required',
                    invalid_type_error: 'message must be string',
                })
                .max(255, {
                    message: 'message should be less then  255 character',
                }),
            file: z.string().optional(),
        })
        .refine((data) => Boolean(data.visa || data.visa_type), {
            message: 'visa or visa_type is required',
            path: ['visa'],
        }),
});

const postVisaApplyValidationSchema = z.object({
    body: z.object({
        full_name: z.string().min(1).max(255).trim().optional(),
        given_name: z.string().min(1).max(120).trim(),
        last_name: z.string().min(1).max(120).trim(),
        gender: z.enum(['male', 'female', 'other']),
        date_of_birth: z.string(),
        nationality: z.string().min(1).max(120).trim(),
        visited_countries: z.string().min(1).max(500).trim(),
        passport_number: z.string().min(1).max(120).trim(),
        passport_expiry_date: z.string(),
        profession: z.string().min(1).max(120).trim(),
        local_address: z.string().min(1).max(500).trim(),
        foreign_address: z.string().min(1).max(500).trim(),
        email: z.string().email(),
        phone: z.string(),
        visa: z.string().refine((d) => mongoose.Types.ObjectId.isValid(d), {
            message: 'visa must be valid objectID',
        }),
        visa_name: z.string().max(255).optional(),
        visa_type_name: z.string().max(255).optional(),
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
