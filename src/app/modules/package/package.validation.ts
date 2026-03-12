import { z } from 'zod';
import mongoose from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postPackageValidationSchema = z.object({
    body: z
        .object({
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
            banner_video_url: z
                .string({
                    required_error: 'Banner video is required',
                    invalid_type_error: 'Banner video must be string',
                })
                .optional(),
            destination: z
                .string({
                    required_error: 'Destination is required',
                    invalid_type_error: 'Destination must be string',
                })
                .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                    message: 'Destination is invalid',
                }),
            section: z
                .array(
                    z.enum(['popular', 'trending'], {
                        message: 'Section must be popular or trending',
                    }),
                    {
                        message: 'Section must be an array',
                    },
                )
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
                        invalid_type_error:
                            'discount type must be flat or percent',
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
                        !(
                            data.discount_type == 'percent' &&
                            100 < data.discount
                        ),
                    {
                        message:
                            'Discount cannot be greater than 100 when discount type is percent',
                        path: ['discount'],
                    },
                ),
            check_in: z
                .string({
                    required_error: 'check_in is required',
                    invalid_type_error: 'check_in must be string',
                })
                .date(),
            check_out: z
                .string({
                    required_error: 'check_out is required',
                    invalid_type_error: 'check_out must be string',
                })
                .date(),
            group_size: z.number({
                required_error: 'group_size is required',
                invalid_type_error: 'group_size must be number',
            }),
            tour_type: z.string({
                required_error: 'tour_type is required',
                invalid_type_error: 'tour_type must be string',
            }),
            start_location: z.string({
                required_error: 'start_location is required',
                invalid_type_error: 'start_location must be string',
            }),
            end_location: z.string({
                required_error: 'end_location is required',
                invalid_type_error: 'end_location must be string',
            }),
            difficulty_level: z.enum(['easy', 'moderate', 'hard'], {
                required_error: 'difficulty_level is required',
                invalid_type_error:
                    'difficulty_level must be easy, moderate or hard',
            }),
            transport_type: z.string({
                required_error: 'transport_type is required',
                invalid_type_error: 'transport_type must be string',
            }),
            min_age: z.number({
                required_error: 'min_age is required',
                invalid_type_error: 'min_age must be number',
            }),
            accommodation_type: z.string({
                required_error: 'accommodation_type is required',
                invalid_type_error: 'accommodation_type must be string',
            }),
            meals_included: z.string({
                required_error: 'meals_included is required',
                invalid_type_error: 'meals_included must be string',
            }),
            about: z.record(
                languageEnum,
                z.string({
                    required_error: 'about is required',
                    invalid_type_error: 'about must be string',
                }),
            ),
            activities: z
                .array(
                    z
                        .string({
                            invalid_type_error: '_id must be string',
                            required_error: '_id is required',
                        })
                        .refine(
                            (data) => mongoose.Types.ObjectId.isValid(data),
                            {
                                message: '_id is invalid',
                            },
                        ),
                    {
                        message: 'activities must be array of object',
                    },
                )
                .nonempty({
                    message: 'At least one activities is required.',
                }),
            highlight: z
                .array(
                    z.record(
                        languageEnum,
                        z.string({
                            required_error: 'highlight is required',
                            invalid_type_error: 'highlight must be string',
                        }),
                    ),
                )
                .nonempty({
                    message: 'At least one highlight is required.',
                }),
            includes: z
                .array(
                    z.record(
                        languageEnum,
                        z.string({
                            required_error: 'include is required',
                            invalid_type_error: 'include must be string',
                        }),
                    ),
                )
                .nonempty({
                    message: 'At least one include is required.',
                }),
            excludes: z
                .array(
                    z.record(
                        languageEnum,
                        z.string({
                            required_error: 'exclude is required',
                            invalid_type_error: 'exclude must be string',
                        }),
                    ),
                )
                .nonempty({
                    message: 'At least one exclude is required.',
                }),
            feathers: z.array(
                z.object({
                    logo: z.string({
                        invalid_type_error: 'logo must be string',
                        required_error: 'logo is required',
                    }),
                    text: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'text is required',
                            invalid_type_error: 'text must be string',
                        }),
                    ),
                }),
            ),
            itinerary_about: z
                .record(
                    languageEnum,
                    z.string({
                        required_error: 'itinerary is required',
                        invalid_type_error: 'itinerary is required',
                    }),
                )
                .optional(),
            itinerary: z
                .array(
                    z.object({
                        heading: z.record(
                            languageEnum,
                            z.string({
                                required_error: 'heading is required',
                                invalid_type_error: 'heading must be string',
                            }),
                        ),
                        description: z.record(
                            languageEnum,
                            z.string({
                                required_error: 'description is required',
                                invalid_type_error:
                                    'description must be string',
                            }),
                        ),
                    }),
                )
                .optional(),
        })
        .refine(
            (data) => {
                const checkIn = new Date(data.check_in);
                const checkOut = new Date(data.check_out);
                return checkIn < checkOut;
            },
            {
                message: 'check_out must be after check_in',
                path: ['check_in'],
            },
        ),
});
const postPackageBookingCalculationValidationSchema = z.object({
    body: z.object({
        package: z
            .string({
                required_error: 'package is required',
                invalid_type_error: 'package must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        person: z
            .number({
                required_error: 'person is required',
                invalid_type_error: 'person must be number',
            })
            .positive({
                message: 'person must be positive',
            }),
        services: z
            .array(
                z
                    .string({
                        required_error: 'service is required',
                        invalid_type_error: 'service must be string',
                    })
                    .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                        message: '_id is invalid',
                    }),
            )
            .optional(),
    }),
});
const postPackageBookingValidationSchema = z.object({
    body: z.object({
        package: z
            .string({
                required_error: 'package is required',
                invalid_type_error: 'package must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        person: z
            .number({
                required_error: 'person is required',
                invalid_type_error: 'person must be number',
            })
            .positive({
                message: 'person must be positive',
            }),
        services: z
            .array(
                z
                    .string({
                        required_error: 'service is required',
                        invalid_type_error: 'service must be string',
                    })
                    .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                        message: '_id is invalid',
                    }),
            )
            .optional(),
        amount: z
            .number({
                required_error: 'amount is required',
                invalid_type_error: 'amount must be number',
            })
            .nonnegative({
                message: 'amount must be non-negative',
            }),
        method: z.enum(['stripe', 'paypal', 'razorpay'], {
            required_error: 'payment is required',
            message: 'payment method must be stripe, paypal and razorpay',
        }),
    }),
});
const updatePackageValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),

        name: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Name is required',
                        invalid_type_error: 'Name must be string',
                    })
                    .max(255, {
                        message: 'Name must be at least 255 characters',
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
        banner_video_url: z
            .string({
                required_error: 'Banner video is required',
                invalid_type_error: 'Banner video must be string',
            })
            .optional(),
        destination: z
            .string({
                invalid_type_error: 'destination must be string',
                required_error: 'destination is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'destination is invalid',
            })
            .optional(),
        section: z
            .array(
                z.enum(['popular', 'trending'], {
                    message: 'Section must be popular or trending',
                }),
                {
                    message: 'Section must be an array',
                },
            )
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
        check_in: z
            .string({
                required_error: 'check_in is required',
                invalid_type_error: 'check_in must be string',
            })
            .date()
            .optional(),
        check_out: z
            .string({
                required_error: 'check_out is required',
                invalid_type_error: 'check_out must be string',
            })
            .date()
            .optional(),
        group_size: z
            .number({
                required_error: 'group_size is required',
                invalid_type_error: 'group_size must be number',
            })
            .optional(),
        tour_type: z
            .string({
                required_error: 'tour_type is required',
                invalid_type_error: 'tour_type must be string',
            })
            .optional(),
        start_location: z
            .string({
                required_error: 'start_location is required',
                invalid_type_error: 'start_location must be string',
            })
            .optional(),
        end_location: z
            .string({
                required_error: 'end_location is required',
                invalid_type_error: 'end_location must be string',
            })
            .optional(),
        difficulty_level: z
            .enum(['easy', 'moderate', 'hard'], {
                required_error: 'difficulty_level is required',
                invalid_type_error:
                    'difficulty_level must be easy, moderate or hard',
            })
            .optional(),
        transport_type: z
            .string({
                required_error: 'transport_type is required',
                invalid_type_error: 'transport_type must be string',
            })
            .optional(),
        min_age: z
            .number({
                required_error: 'min_age is required',
                invalid_type_error: 'min_age must be number',
            })
            .optional(),
        accommodation_type: z
            .string({
                required_error: 'accommodation_type is required',
                invalid_type_error: 'accommodation_type must be string',
            })
            .optional(),
        meals_included: z
            .string({
                required_error: 'meals_included is required',
                invalid_type_error: 'meals_included must be string',
            })
            .optional(),
        about: z
            .record(
                languageEnum,
                z.string({
                    required_error: 'about is required',
                    invalid_type_error: 'about must be string',
                }),
            )
            .optional(),
        activities: z
            .array(
                z
                    .string({
                        invalid_type_error: '_id must be string',
                        required_error: '_id is required',
                    })
                    .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                        message: '_id is invalid',
                    }),
                {
                    message: 'activities must be array of object',
                },
            )
            .nonempty({
                message: 'At least one activities is required.',
            })
            .optional(),
        highlight: z
            .array(
                z.record(
                    languageEnum,
                    z.string({
                        required_error: 'highlight is required',
                        invalid_type_error: 'highlight must be string',
                    }),
                ),
            )
            .nonempty({
                message: 'At least one highlight is required.',
            })
            .optional(),
        includes: z
            .array(
                z.record(
                    languageEnum,
                    z.string({
                        required_error: 'include is required',
                        invalid_type_error: 'include must be string',
                    }),
                ),
            )
            .optional(),
        excludes: z
            .array(
                z.record(
                    languageEnum,
                    z.string({
                        required_error: 'exclude is required',
                        invalid_type_error: 'exclude must be string',
                    }),
                ),
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
                        z.string({
                            required_error: 'text is required',
                            invalid_type_error: 'text must be string',
                        }),
                    ),
                }),
            )
            .optional(),
        itinerary_about: z
            .record(
                languageEnum,
                z.string({
                    required_error: 'itinerary is required',
                    invalid_type_error: 'itinerary is required',
                }),
            )
            .optional(),
        itinerary: z
            .array(
                z.object({
                    heading: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'heading is required',
                            invalid_type_error: 'heading must be string',
                        }),
                    ),
                    description: z.record(
                        languageEnum,
                        z.string({
                            required_error: 'description is required',
                            invalid_type_error: 'description must be string',
                        }),
                    ),
                }),
            )
            .optional(),
    }),
});
const updatePackageBookingValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'], {
            message: 'status must be pending, confirmed, cancelled, completed',
        }),
    }),
});
export const PackageValidations = {
    postPackageValidationSchema,
    postPackageBookingValidationSchema,
    postPackageBookingCalculationValidationSchema,
    updatePackageValidationSchema,
    updatePackageBookingValidationSchema,
};
