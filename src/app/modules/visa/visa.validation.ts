import { z } from 'zod';
import mongoose from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postVisasValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Title is required',
                    invalid_type_error: 'Title must be string',
                })
                .max(255, {
                    message:
                        'Title must be less then or equal to  255 characters',
                }),
        ),
        banner_image: z.string({
            required_error: 'Banner image is required',
            invalid_type_error: 'Banner image must be string',
        }),
        card_image: z.string({
            required_error: 'Card image is required',
            invalid_type_error: 'Card image must be string',
        }),
        images: z
            .array(
                z.string({
                    required_error: 'Images is required',
                    invalid_type_error: 'Images must be string',
                }),
            )
            .optional(),
        visa_type: z
            .string({
                required_error: 'Visa type is required',
                invalid_type_error: 'Visa type must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Visa type is invalid',
            }),
        language: z
            .string({
                required_error: 'Language is required',
                invalid_type_error: 'Language must be string',
            })
            .optional(),
        validity: z.string({
            required_error: 'validity is required',
            invalid_type_error: 'validity must be string',
        }),
        processing_type: z.string({
            required_error: 'Processing type is required',
            invalid_type_error: 'Processing type must be string',
        }),
        visa_mode: z.string({
            required_error: 'Visa mode is required',
            invalid_type_error: 'Visa mode must be string',
        }),
        country: z.string({
            required_error: 'Country is required',
            invalid_type_error: 'Country must be string',
        }),
        price: z
            .object({
                amount: z
                    .number({
                        invalid_type_error: 'price amount must be a number',
                        required_error: 'price amount is required',
                    })
                    .nonnegative({
                        message: 'price must be non negative',
                    }),
                discount_type: z.enum(['flat', 'percent'], {
                    required_error: 'discount type is required',
                    invalid_type_error: 'discount type must be flat or percent',
                }),
                discount: z
                    .number({
                        required_error: 'discount is required',
                        invalid_type_error: 'discount type must be number',
                    })
                    .nonnegative({
                        message: 'discount must be non negative',
                    }),
            })
            .refine(
                (data) =>
                    !(
                        data.discount_type == 'flat' &&
                        data.amount < data.discount
                    ),
                {
                    message:
                        'Discount cannot be greater than amount when discount type is flat',
                    path: ['discount'],
                },
            )
            .refine(
                (data) =>
                    !(data.discount_type == 'percent' && 100 < data.discount),
                {
                    message:
                        'Discount cannot be greater than 100 when discount type is percent',
                    path: ['discount'],
                },
            ),

        overview: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'overview is required',
                    invalid_type_error: 'overview must be string',
                })
                .max(5000, {
                    message:
                        'overview must be less than or equal to  5000 characters',
                }),
        ),
        documents: z
            .array(
                z.object({
                    key: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'documents key is required',
                            invalid_type_error: 'documents key must be string',
                        }),
                    ),
                    value: z.record(
                        languageEnum,
                        z
                            .string({
                                required_error: 'documents value is required',
                                invalid_type_error:
                                    'documents value must be string',
                            })
                            .max(5000, {
                                message:
                                    'documents value must be less than or equal to  5000 characters',
                            }),
                    ),
                }),
            )
            .optional(),
        document_about: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Document about is required',
                    invalid_type_error: 'Document about  must be string',
                })
                .max(5000, {
                    message:
                        'Document about must be less than or equal to  5000 characters',
                }),
        ),
        continent: z.record(languageEnum, z.string()).optional(),
        capital: z.record(languageEnum, z.string()).optional(),
        official_language: z.record(languageEnum, z.string()).optional(),
        currency: z.record(languageEnum, z.string()).optional(),
        local_time: z.record(languageEnum, z.string()).optional(),
        exchange_rate: z.record(languageEnum, z.string()).optional(),
        dialing_code: z.string().optional(),
        weekend_days: z.record(languageEnum, z.string()).optional(),
        population: z.record(languageEnum, z.string()).optional(),
        area: z.record(languageEnum, z.string()).optional(),
        education: z.record(languageEnum, z.string()).optional(),
        religion: z.record(languageEnum, z.string()).optional(),
        embassy_address: z.record(languageEnum, z.string()).optional(),
        apply_fee: z.number().nonnegative().optional(),

        feathers: z.array(
            z.object({
                logo: z.string({
                    invalid_type_error: 'logo must be string',
                    required_error: 'logo is required',
                }),
                text: z.record(
                    languageEnum,
                    z
                        .string({
                            required_error: 'text is required',
                            invalid_type_error: 'text must be string',
                        })
                        .max(5000, {
                            message:
                                'feather text must be less than or equal to  5000 characters',
                        }),
                ),
            }),
        ),

        faqs: z
            .array(
                z.object({
                    heading: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'faqs heading is required',
                            invalid_type_error: 'faqs heading must be string',
                        }),
                    ),
                    description: z.record(
                        languageEnum,
                        z
                            .string({
                                required_error: 'faqs description is required',
                                invalid_type_error:
                                    'faqs description must be string',
                            })
                            .max(5000, {
                                message:
                                    'faqs description must be less than or equal to  5000 characters',
                            }),
                    ),
                }),
            )
            .optional(),
    }),
});
const updateVisasValidationSchema = z.object({
    body: z.object({
        title: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Title is required',
                        invalid_type_error: 'Title must be string',
                    })
                    .max(255, {
                        message:
                            'Title must be less then or equal to  255 characters',
                    }),
            )
            .optional(),
        banner_image: z
            .string({
                required_error: 'Banner image is required',
                invalid_type_error: 'Banner image must be string',
            })
            .optional(),
        card_image: z
            .string({
                required_error: 'Card image is required',
                invalid_type_error: 'Card image must be string',
            })
            .optional(),
        images: z
            .array(
                z.string({
                    required_error: 'Images is required',
                    invalid_type_error: 'Images must be string',
                }),
            )
            .optional(),
        visa_type: z
            .string({
                required_error: 'Visa type is required',
                invalid_type_error: 'Visa type must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Visa type is invalid',
            })
            .optional(),
        language: z
            .string({
                required_error: 'Language is required',
                invalid_type_error: 'Language must be string',
            })
            .optional(),
        validity: z
            .string({
                required_error: 'validity is required',
                invalid_type_error: 'validity must be string',
            })
            .optional(),
        processing_type: z
            .string({
                required_error: 'Processing type is required',
                invalid_type_error: 'Processing type must be string',
            })
            .optional(),
        visa_mode: z
            .string({
                required_error: 'Visa mode is required',
                invalid_type_error: 'Visa mode must be string',
            })
            .optional(),
        country: z
            .string({
                required_error: 'Country is required',
                invalid_type_error: 'Country must be string',
            })
            .optional(),
        price: z
            .object({
                amount: z
                    .number({
                        invalid_type_error: 'price amount must be a number',
                        required_error: 'price amount is required',
                    })
                    .nonnegative({
                        message: 'price must be non negative',
                    }),
                discount_type: z.enum(['flat', 'percent'], {
                    required_error: 'discount type is required',
                    invalid_type_error: 'discount type must be flat or percent',
                }),
                discount: z
                    .number({
                        required_error: 'discount is required',
                        invalid_type_error: 'discount type must be number',
                    })
                    .nonnegative({
                        message: 'discount must be non negative',
                    }),
            })
            .refine(
                (data) =>
                    !(
                        data.discount_type == 'flat' &&
                        data.amount < data.discount
                    ),
                {
                    message:
                        'Discount cannot be greater than amount when discount type is flat',
                    path: ['discount'],
                },
            )
            .refine(
                (data) =>
                    !(data.discount_type == 'percent' && 100 < data.discount),
                {
                    message:
                        'Discount cannot be greater than 100 when discount type is percent',
                    path: ['discount'],
                },
            )
            .optional(),

        overview: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'overview is required',
                        invalid_type_error: 'overview must be string',
                    })
                    .max(5000, {
                        message:
                            'overview must be less than or equal to  5000 characters',
                    }),
            )
            .optional(),
        documents: z
            .array(
                z.object({
                    key: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'documents key is required',
                            invalid_type_error: 'documents key must be string',
                        }),
                    ),
                    value: z.record(
                        languageEnum,
                        z
                            .string({
                                required_error: 'documents value is required',
                                invalid_type_error:
                                    'documents value must be string',
                            })
                            .max(5000, {
                                message:
                                    'documents value must be less than or equal to  5000 characters',
                            }),
                    ),
                }),
            )
            .optional(),
        document_about: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Document about is required',
                        invalid_type_error: 'Document about  must be string',
                    })
                    .max(5000, {
                        message:
                            'Document about must be less than or equal to  5000 characters',
                    }),
            )
            .optional(),
        continent: z.record(languageEnum, z.string()).optional(),
        capital: z.record(languageEnum, z.string()).optional(),
        official_language: z.record(languageEnum, z.string()).optional(),
        currency: z.record(languageEnum, z.string()).optional(),
        local_time: z.record(languageEnum, z.string()).optional(),
        exchange_rate: z.record(languageEnum, z.string()).optional(),
        dialing_code: z.string().optional(),
        weekend_days: z.record(languageEnum, z.string()).optional(),
        population: z.record(languageEnum, z.string()).optional(),
        area: z.record(languageEnum, z.string()).optional(),
        education: z.record(languageEnum, z.string()).optional(),
        religion: z.record(languageEnum, z.string()).optional(),
        embassy_address: z.record(languageEnum, z.string()).optional(),
        apply_fee: z.number().nonnegative().optional(),

        feathers: z
            .array(
                z.object({
                    logo: z.string({
                        invalid_type_error: 'logo must be string',
                        required_error: 'logo is required',
                    }),
                    text: z.record(
                        languageEnum,
                        z
                            .string({
                                required_error: 'text is required',
                                invalid_type_error: 'text must be string',
                            })
                            .max(5000, {
                                message:
                                    'feather text must be less than or equal to  5000 characters',
                            }),
                    ),
                }),
            )
            .optional(),

        faqs: z
            .array(
                z.object({
                    heading: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'faqs heading is required',
                            invalid_type_error: 'faqs heading must be string',
                        }),
                    ),
                    description: z.record(
                        languageEnum,
                        z
                            .string({
                                required_error: 'faqs description is required',
                                invalid_type_error:
                                    'faqs description must be string',
                            })
                            .max(5000, {
                                message:
                                    'faqs description must be less than or equal to  5000 characters',
                            }),
                    ),
                }),
            )
            .optional(),
    }),
});
export const VisaValidations = {
    postVisasValidationSchema,
    updateVisasValidationSchema,
};
