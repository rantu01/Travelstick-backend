import { z } from 'zod';
import mongoose from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postHotelValidationSchema = z.object({
    body: z.object({
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
                required_error: 'Banner video url is required',
                invalid_type_error: 'Banner video url must be string',
            })
            .optional(),
        star: z
            .number({
                required_error: 'star is required',
                invalid_type_error: 'star must be number',
            })
            .gte(1, {
                message: 'star must be greater than or equal to 1',
            })
            .lte(5, {
                message: 'star must be less than or equal to 5',
            }),
        hotel_type: z.string({
            required_error: 'hotel_type is required',
            invalid_type_error: 'hotel_type must be string',
        }),
        room_type: z.string({
            required_error: 'room_type is required',
            invalid_type_error: 'room_type must be string',
        }),
        limit: z
            .number({
                required_error: 'limit is required',
                invalid_type_error: 'limit must be number',
            })
            .nonnegative({
                message: 'limit must be non-negative',
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
        about: z.record(
            languageEnum,
            z.string({
                required_error: 'about is required',
                invalid_type_error: 'about must be string',
            }),
        ),
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
        include: z
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
        exclude: z
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
        destination: z
            .string({
                required_error: 'Destination is required',
                invalid_type_error: 'Destination must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Destination is invalid',
            }),
        mapLink: z
            .string({
                invalid_type_error: 'Map link must be string',
            })
            .optional(),
    }),
});
const postHotelBookingCalculationValidationSchema = z.object({
    body: z.object({
        hotel: z
            .string({
                required_error: 'hotel is required',
                invalid_type_error: 'hotel must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: ' hotel _id is invalid',
            }),
        person: z
            .number({
                required_error: 'person is required',
                invalid_type_error: 'person must be number',
            })
            .positive({
                message: 'person must be positive',
            }),
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
const postHotelBookingValidationSchema = z.object({
    body: z.object({
        hotel: z
            .string({
                required_error: 'package is required',
                invalid_type_error: 'package must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
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
const updateHotelValidationSchema = z.object({
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
                required_error: 'Banner video url is required',
                invalid_type_error: 'Banner video url must be string',
            })
            .optional(),
        star: z
            .number({
                required_error: 'star is required',
                invalid_type_error: 'star must be number',
            })
            .gte(1, {
                message: 'star must be greater than or equal to 1',
            })
            .lte(5, {
                message: 'star must be less than or equal to 5',
            })
            .optional(),
        hotel_type: z
            .string({
                required_error: 'hotel_type is required',
                invalid_type_error: 'hotel_type must be string',
            })
            .optional(),
        room_type: z
            .string({
                required_error: 'room_type is required',
                invalid_type_error: 'room_type must be string',
            })
            .optional(),
        limit: z
            .number({
                required_error: 'limit is required',
                invalid_type_error: 'limit must be number',
            })
            .nonnegative({
                message: 'limit must be non-negative',
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
        about: z
            .record(
                languageEnum,
                z.string({
                    required_error: 'about is required',
                    invalid_type_error: 'about must be string',
                }),
            )
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
        include: z
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
            })
            .optional(),
        exclude: z
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
            })
            .optional(),
        destination: z
            .string({
                required_error: 'Destination is required',
                invalid_type_error: 'Destination must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Destination is invalid',
            })
            .optional(),
        mapLink: z
            .string({
                invalid_type_error: 'Map link must be string',
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
const updateHotelBookingValidationSchema = z.object({
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
export const HotelValidations = {
    postHotelValidationSchema,
    postHotelBookingCalculationValidationSchema,
    postHotelBookingValidationSchema,
    updateHotelValidationSchema,
};
