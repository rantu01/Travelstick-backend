import { z } from 'zod';
import mongoose from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postActivityValidationSchema = z.object({
    body: z.object({
        name: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Name is required',
                    invalid_type_error: 'Name must be string',
                })
                .max(255, {
                    message: 'Name must be at least 255 characters',
                }),
        ),
    }),
});
const updateActivityValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        name: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Name is required',
                    invalid_type_error: 'Name must be string',
                })
                .max(255, {
                    message: 'Name must be at least 255 characters',
                }),
        ),
    }),
});
export const ActivityValidations = {
    postActivityValidationSchema,
    updateActivityValidationSchema,
};
