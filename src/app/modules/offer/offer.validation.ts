import { z } from 'zod';
import mongoose from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postOfferValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'title is required',
                    invalid_type_error: 'title must be string',
                })
                .max(255, {
                    message: 'title must be at least 255 characters',
                }),
        ),
        description: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'description is required',
                    invalid_type_error: 'description must be string',
                })
                .max(255, {
                    message: 'description must be at least 255 characters',
                }),
        ),
        offer_type: z
            .enum(['weakly', 'monthly', 'yearly'], {
                message: 'Offer type must be weakly , monthly and yearly',
            })
            .default('weakly'),
        image: z.string({
            required_error: 'image is required',
            invalid_type_error: 'image must be string',
        }),
        discount_type: z.enum(['flat', 'percent'], {
            message: 'Discount type must be flat and percent',
        }),
        discount: z
            .number({
                invalid_type_error: 'discount must be number',
                required_error: 'discount is required',
            })
            .default(0),
    }),
});

const updateOfferValidationSchema = z.object({
    body: z.object({
        title: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'title is required',
                        invalid_type_error: 'title must be string',
                    })
                    .max(255, {
                        message: 'title must be at least 255 characters',
                    }),
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'description is required',
                        invalid_type_error: 'description must be string',
                    })
                    .max(255, {
                        message: 'description must be at least 255 characters',
                    }),
            )
            .optional(),
        offer_type: z
            .enum(['weakly', 'monthly', 'yearly'], {
                message: 'Offer type must be weakly , monthly and yearly',
            })
            .optional(),
        image: z
            .string({
                required_error: 'image is required',
                invalid_type_error: 'image must be string',
            })
            .optional(),
        discount_type: z
            .enum(['flat', 'percent'], {
                message: 'Discount type must be flat and percent',
            })
            .optional(),
        discount: z
            .number({
                invalid_type_error: 'discount must be number',
                required_error: 'discount is required',
            })
            .optional(),
        status: z
            .boolean({
                required_error: 'status is required',
                invalid_type_error: 'status must be boolean',
            })
            .optional(),
    }),
});
export const OfferValidations = {
    postOfferValidationSchema,
    updateOfferValidationSchema,
};
