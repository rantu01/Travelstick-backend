import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postBlogTagValidationSchema = z.object({
    body: z.object({
        name: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Tag name must be string',
                    required_error: 'Tag name is required',
                })
                .min(1, {
                    message: 'Tag name is required',
                })
                .max(50, {
                    message:
                        'Tag name must be less than or equal to 50 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Tag name must be object',
            },
        ),
    }),
});
const updateBlogTagValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Tag id must be string',
                required_error: 'Tag id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        name: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Tag name must be string',
                    required_error: 'Tag name is required',
                })
                .min(1, {
                    message: 'Tag name is required',
                })
                .max(50, {
                    message:
                        'Tag name must be less than or equal to 50 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Tag name must be object',
            },
        ),
    }),
});
export const BlogTagValidations = {
    postBlogTagValidationSchema,
    updateBlogTagValidationSchema,
};
