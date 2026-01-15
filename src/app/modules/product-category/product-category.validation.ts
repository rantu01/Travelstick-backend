import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postProductCategoryValidationSchema = z.object({
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
                    message: 'Name be less than or equal to 255 characters',
                })
                .trim(),
            {
                message: 'Name must be object',
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
const updateProductCategoryValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        name: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'category name must be string',
                        required_error: 'category name is required',
                    })
                    .min(1, {
                        message: 'category name is required',
                    })
                    .max(50, {
                        message:
                            'category name must be less than or equal to 50 characters',
                    })
                    .trim(),
                {
                    message: 'category name must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error:
                            'Category description must be string',
                        required_error: 'description is required',
                    })
                    .optional(),
                {
                    message: 'Category description must be object',
                },
            )
            .optional(),
    }),
});
export const ProductCategoryValidations = {
    postProductCategoryValidationSchema,
    updateProductCategoryValidationSchema,
};
