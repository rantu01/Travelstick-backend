import { z } from 'zod';
import mongoose from 'mongoose';

const postSubscriberValidationSchema = z.object({
    body: z.object({
        email: z
            .string({
                invalid_type_error: 'Email must be string',
                required_error: 'Email is required',
            })
            .email({
                message: 'Email should be a valid email address',
            }),
    }),
});
const sendEmailSubscriberValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            })
            .optional(),
        subject: z
            .string({
                invalid_type_error: 'Subject must be string',
                required_error: 'Subject is required',
            })
            .min(1, {
                message: 'Subject must be required',
            })
            .max(100, {
                message: 'Subject should be less than 100 characters',
            }),
        message: z.string({
            invalid_type_error: 'Message must be string',
            required_error: 'Message is required',
        }),
    }),
});
export const SubscriberValidations = {
    postSubscriberValidationSchema,
    sendEmailSubscriberValidationSchema,
};
