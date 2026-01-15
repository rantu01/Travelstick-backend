import { z } from 'zod';
import mongoose from 'mongoose';

const pageSettingValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Page _id is invalid',
            }),
        status: z
            .boolean({
                invalid_type_error: 'status must be boolean',
                required_error: 'status is required',
            })
            .optional(),
        content: z.any().optional(),
    }),
});

export const SettingPageValidations = {
    pageSettingValidationSchema,
};
