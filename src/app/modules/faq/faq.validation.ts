import { z } from 'zod';
import { languageEnum } from '../../utils/constants';

const postFaqValidationSchema = z.object({
    body: z.object({
        question: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Question must be string',
                    required_error: 'Question is required',
                })
                .min(1, {
                    message: 'Question is required',
                })
                .max(255, {
                    message:
                        'Question must be less than or equal to 255 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Question must be object',
            },
        ),
        answer: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Answer must be string',
                    required_error: 'Answer is required',
                })
                .min(1, {
                    message: 'Answer is required',
                })
                .max(255, {
                    message:
                        'Answer must be less than or equal to 255 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Answer must be object',
            },
        ),
    }),
});

const updateFaqValidationSchema = z.object({
    body: z.object({
        question: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Question must be string',
                        required_error: 'Question is required',
                    })
                    .min(1, {
                        message: 'Question is required',
                    })
                    .max(255, {
                        message:
                            'Question must be less than or equal to 255 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Question must be object',
                },
            )
            .optional(),
        answer: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Answer must be string',
                        required_error: 'Answer is required',
                    })
                    .min(1, {
                        message: 'Answer is required',
                    })
                    .max(255, {
                        message:
                            'Answer must be less than or equal to 255 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Answer must be object',
                },
            )
            .optional(),
    }),
});

export const FaqValidations = {
    postFaqValidationSchema,
    updateFaqValidationSchema,
};
