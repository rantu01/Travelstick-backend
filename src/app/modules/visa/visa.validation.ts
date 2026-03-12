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
                        'Title must be less then or equal to 255 characters',
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
        citizen_of: z.string({
            required_error: 'Citizen of is required',
            invalid_type_error: 'Citizen of must be string',
        }),
        travelling_to: z.string({
            required_error: 'Travelling to is required',
            invalid_type_error: 'Travelling to must be string',
        }),
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
        }).optional(),
        country: z.string({
            required_error: 'Country is required',
            invalid_type_error: 'Country must be string',
        }).optional(),
        price: z
            .object({
                amount: z
                    .number({
                        invalid_type_error: 'price amount must be a number',
                        required_error: 'price amount is required',
                    })
                    .nonnegative({ message: 'price must be non negative' }),
                discount_type: z
                    .enum(['flat', 'percent'], {
                        invalid_type_error: 'discount type must be flat or percent',
                    })
                    .optional(),
                discount: z
                    .number({
                        invalid_type_error: 'discount must be number',
                    })
                    .nonnegative({ message: 'discount must be non negative' })
                    .optional(),
            })
            .optional(),

        // ✅ 5000 → 500000 (unlimited practical limit)
        overview: z.record(
            languageEnum,
            z.string({
                required_error: 'overview is required',
                invalid_type_error: 'overview must be string',
            }).max(50000000000000000, {
                message: 'overview must be less than or equal to 500000 characters',
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
                        z.string({
                            required_error: 'documents value is required',
                            invalid_type_error: 'documents value must be string',
                            // ✅ 5000 → 50000
                        }).max(50000, {
                            message: 'documents value must be less than or equal to 50000 characters',
                        }),
                    ),
                }),
            )
            .optional(),
        // ✅ 5000 → 50000
        document_about: z.record(
            languageEnum,
            z.string({
                required_error: 'Document about is required',
                invalid_type_error: 'Document about must be string',
            }).max(50000, {
                message: 'Document about must be less than or equal to 50000 characters',
            }),
        ),

        feathers: z.array(
            z.object({
                logo: z.string({
                    invalid_type_error: 'logo must be string',
                    required_error: 'logo is required',
                }),
                text: z.record(
                    languageEnum,
                    // ✅ 5000 → 50000
                    z.string({
                        required_error: 'text is required',
                        invalid_type_error: 'text must be string',
                    }).max(50000, {
                        message: 'feather text must be less than or equal to 50000 characters',
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
                        // ✅ 5000 → 50000
                        z.string({
                            required_error: 'faqs description is required',
                            invalid_type_error: 'faqs description must be string',
                        }).max(50000, {
                            message: 'faqs description must be less than or equal to 50000 characters',
                        }),
                    ),
                }),
            )
            .optional(),

        visa_code: z.string().optional(),
        max_stay_days: z.number().nonnegative().optional(),
        entry_type: z.enum(['single', 'double', 'multiple']).optional(),
        visa_category: z.string().optional(),
    }),
});

const updateVisasValidationSchema = z.object({
    body: z.object({
        title: z
            .record(
                languageEnum,
                z.string({
                    required_error: 'Title is required',
                    invalid_type_error: 'Title must be string',
                }).max(255, {
                    message: 'Title must be less then or equal to 255 characters',
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
        citizen_of: z
            .string({
                required_error: 'Citizen of is required',
                invalid_type_error: 'Citizen of must be string',
            })
            .optional(),
        travelling_to: z
            .string({
                required_error: 'Travelling to is required',
                invalid_type_error: 'Travelling to must be string',
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
                    .nonnegative({ message: 'price must be non negative' }),
                discount_type: z
                    .enum(['flat', 'percent'], {
                        invalid_type_error: 'discount type must be flat or percent',
                    })
                    .optional(),
                discount: z
                    .number({
                        invalid_type_error: 'discount must be number',
                    })
                    .nonnegative({ message: 'discount must be non negative' })
                    .optional(),
            })
            .optional(),

        // ✅ 5000 → 500000
        overview: z
            .record(
                languageEnum,
                z.string({
                    required_error: 'overview is required',
                    invalid_type_error: 'overview must be string',
                }).max(500000, {
                    message: 'overview must be less than or equal to 500000 characters',
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
                        // ✅ 5000 → 50000
                        z.string({
                            required_error: 'documents value is required',
                            invalid_type_error: 'documents value must be string',
                        }).max(50000, {
                            message: 'documents value must be less than or equal to 50000 characters',
                        }),
                    ),
                }),
            )
            .optional(),
        // ✅ 5000 → 50000
        document_about: z
            .record(
                languageEnum,
                z.string({
                    required_error: 'Document about is required',
                    invalid_type_error: 'Document about must be string',
                }).max(50000, {
                    message: 'Document about must be less than or equal to 50000 characters',
                }),
            )
            .optional(),

        feathers: z
            .array(
                z.object({
                    logo: z.string({
                        invalid_type_error: 'logo must be string',
                        required_error: 'logo is required',
                    }),
                    text: z.record(
                        languageEnum,
                        // ✅ 5000 → 50000
                        z.string({
                            required_error: 'text is required',
                            invalid_type_error: 'text must be string',
                        }).max(50000, {
                            message: 'feather text must be less than or equal to 50000 characters',
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
                        // ✅ 5000 → 50000
                        z.string({
                            required_error: 'faqs description is required',
                            invalid_type_error: 'faqs description must be string',
                        }).max(50000, {
                            message: 'faqs description must be less than or equal to 50000 characters',
                        }),
                    ),
                }),
            )
            .optional(),
        visa_code: z.string().optional(),
        max_stay_days: z.number().nonnegative().optional(),
        entry_type: z.enum(['single', 'double', 'multiple']).optional(),
        visa_category: z.string().optional(),
    }),
});

export const VisaValidations = {
    postVisasValidationSchema,
    updateVisasValidationSchema,
};