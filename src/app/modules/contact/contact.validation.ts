import { z } from 'zod';
import mongoose from 'mongoose';

const postContactValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .max(255, {
                message: 'Name must be at least 255 characters',
            }),
        email: z
            .string({
                invalid_type_error: 'Email must be string',
                required_error: 'Email is required',
            })
            .email({
                message: 'Email must be valid',
            }),
        subject: z
            .string({
                invalid_type_error: 'Subject must be string',
                required_error: 'Subject is required',
            })
            .max(255, {
                message: 'Subject must be at least 255 characters',
            }),
        message: z
            .string({
                invalid_type_error: 'Message must be string',
                required_error: 'Message is required',
            })
            .max(500, {
                message: 'Message must be at least 500 characters',
            }),
    }),
});
const postContactEmailValidationSchema = z.object({
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
const postContactReplayValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
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
export const ContactValidations = {
    postContactValidationSchema,
    postContactEmailValidationSchema,
    postContactReplayValidationSchema
};
