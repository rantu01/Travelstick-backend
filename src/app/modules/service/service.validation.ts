import { z } from 'zod';
import { languageEnum } from '../../utils/constants';
import mongoose from 'mongoose';

const updateServiceValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                required_error: '_id is required',
                invalid_type_error: '_id must be required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id must be valid',
            }),
        title: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Title must be string',
                        required_error: 'Title is required',
                    })
                    .min(1, {
                        message: 'Title is required',
                    })
                    .max(255, {
                        message:
                            'Title must be less than or equal to 255 characters',
                    })
                    .trim(),
                {
                    message: 'Title must be object',
                },
            )
            .optional(),
        price: z
            .number({
                required_error: 'Price is required',
                invalid_type_error: 'Price must be a number',
            })
            .nonnegative({
                message: 'Price must be non-negative',
            })
            .optional(),
        status: z
            .boolean({
                required_error: 'Status is required',
                invalid_type_error: 'Status must be a boolean',
            })
            .optional(),
    }),
});

export const ServiceValidations = {
    updateServiceValidationSchema,
};
