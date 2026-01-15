import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postBlogCategoryValidationSchema = z.object({
    body: z.object({
        name: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Name must be string',
                    required_error: 'Name is required',
                })
                .min(1, {
                    message: 'Name is required',
                })
                .max(255, {
                    message:
                        'Name must be less than or equal to 255 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Name must be object',
            },
        ),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Description must be string',
                        required_error: 'Description is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'Description must be object',
                },
            )
            .optional(),
    }),
});
const updateBlogCategoryValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Tag id must be string',
                required_error: 'Tag id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        name: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Blog category name must be string',
                        required_error: 'Blog category name is required',
                    })
                    .min(1, {
                        message: 'Blog category name is required',
                    })
                    .max(50, {
                        message:
                            'Blog category name must be less than or equal to 50 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Blog category name must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error:
                            'Blog category description must be string',
                        required_error: 'Blog category description is required',
                    })
                    .optional(),
                {
                    invalid_type_error:
                        'Blog category description must be object',
                },
            )
            .optional(),
    }),
});
export const BlogCategoryValidations = {
    postBlogCategoryValidationSchema,
    updateBlogCategoryValidationSchema,
};
