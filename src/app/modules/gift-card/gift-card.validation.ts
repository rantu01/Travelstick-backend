import { z } from 'zod';
import { languageEnum } from '../../utils/constants';

const postGiftCardValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({ required_error: 'title is required', invalid_type_error: 'title must be string' })
                .max(255),
        ),
        subtitle: z
            .record(
                languageEnum,
                z.string({ invalid_type_error: 'subtitle must be string' }).max(255),
            )
            .optional(),
        image: z.string().optional(),
        price: z.number().optional(),
        applicable_service: z.string().optional(),
    }),
});

const updateGiftCardValidationSchema = z.object({
    body: z.object({
        title: z
            .record(
                languageEnum,
                z.string({ invalid_type_error: 'title must be string' }).max(255),
            )
            .optional(),
        subtitle: z
            .record(
                languageEnum,
                z.string({ invalid_type_error: 'subtitle must be string' }).max(255),
            )
            .optional(),
        image: z.string().optional(),
        price: z.number().optional(),
        status: z.boolean().optional(),
    }),
});

export const GiftCardValidations = {
    postGiftCardValidationSchema,
    updateGiftCardValidationSchema,
};
