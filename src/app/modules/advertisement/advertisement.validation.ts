import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postAdvertisementValidationSchema = z.object({
    body: z.object({
        title: z.record(
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
                invalid_type_error: 'Title must be object',
            },
        ),
        type: z
            .enum(['image'], {
                invalid_type_error: 'Type must be string',
            })
            .default('image'),
        status: z
            .enum(['public', 'private'], {
                message: 'status must be public or private',
            })
            .default('public'),
        image: z.string({
            invalid_type_error: 'Image must be string',
            required_error: 'Image is required',
        }),
        redirect_url: z
            .string({
                invalid_type_error: 'Redirect url must be string',
                required_error: 'Redirect url is required',
            })
            .optional(),
    }),
});
const updateAdvertisementValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
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
                    invalid_type_error: 'Title must be object',
                },
            )
            .optional(),
        type: z
            .enum(['image'], {
                invalid_type_error: 'Type must be string',
            })
            .default('image'),
        status: z
            .enum(['public', 'private'], {
                message: 'status must be public or private',
            })
            .default('public'),
        image: z
            .string({
                invalid_type_error: 'Image must be string',
                required_error: 'Image is required',
            })
            .optional(),
        redirect_url: z
            .string({
                invalid_type_error: 'Redirect url must be string',
                required_error: 'Redirect url is required',
            })
            .optional(),
    }),
});
const postAdvertisementClickOrImpressionValidationSchema = z.object({
    body: z.object({
        advertisement: z
            .string({
                invalid_type_error: 'advertisement must be string',
                required_error: 'advertisement is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'advertisement is invalid',
            }),
    }),
});
export const AdvertisementValidations = {
    postAdvertisementValidationSchema,
    updateAdvertisementValidationSchema,
    postAdvertisementClickOrImpressionValidationSchema,
};
