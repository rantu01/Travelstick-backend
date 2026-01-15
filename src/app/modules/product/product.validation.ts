import { z } from 'zod';
import { languageEnum } from '../../utils/constants';
import { Types } from 'mongoose';

const postProductValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Name must be a string',
                required_error: 'Name is required',
            })
            .max(255, {
                message: 'Name must be less than 255 characters long',
            }),
        description: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'description be a string',
                    required_error: 'Description is required',
                })
                .max(10000, {
                    message:
                        'Description must be less than 10000 characters long',
                }),
        ),
        additional_info: z
            .record(
                z.string({
                    invalid_type_error: 'additional_info key must be string',
                    required_error: 'Description is required',
                }),
                z.any(),
            )
            .optional(),
        images: z
            .array(
                z.string({
                    invalid_type_error: 'images be a string',
                    required_error: 'Image is required',
                }),
                {
                    message: 'Images must be array',
                },
            )
            .optional(),
        quantity: z
            .number({
                required_error: 'quantity must be a number',
                invalid_type_error: 'quantity is required',
            })
            .nonnegative({
                message: 'Quantity must be a positive integer',
            }),
        price: z.object(
            {
                amount: z.number({
                    invalid_type_error: 'price amount must be a number',
                    required_error: 'Price is required',
                }),
                discount: z
                    .number({
                        invalid_type_error: 'Discount amount must be a number',
                        required_error: 'Discount is required',
                    })
                    .nonnegative({
                        message: 'Discount amount is required',
                    })
                    .optional()
                    .default(0),
                discount_type: z
                    .enum(['flat', 'percent'], {
                        message: 'Discount type must be flat or percent',
                    })
                    .optional()
                    .default('flat'),
            },
            {
                message: 'Price must be object',
            },
        ),
        thumb_image: z.string({
            invalid_type_error: 'Thumb image must be a string',
            required_error: 'Thumb is required',
        }),
        category: z.string({
            invalid_type_error: 'category id must be string',
            required_error: 'category id is required',
        }),
    }),
});
const updateProductValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Name must be a string',
                required_error: 'Name is required',
            })
            .max(255, {
                message: 'Name must be less than 255 characters long',
            })
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'description be a string',
                        required_error: 'Description is required',
                    })
                    .max(10000, {
                        message:
                            'Description must be less than 10000 characters long',
                    }),
            )
            .optional(),
        additional_info: z
            .record(
                z.string({
                    invalid_type_error: 'additional_info key must be string',
                    required_error: 'Description is required',
                }),
                z.any(),
            )
            .optional(),
        images: z
            .array(
                z.string({
                    invalid_type_error: 'images be a string',
                    required_error: 'Image is required',
                }),
                {
                    message: 'Images must be array',
                },
            )
            .optional(),
        quantity: z
            .number({
                required_error: 'quantity must be a number',
                invalid_type_error: 'quantity is required',
            })
            .nonnegative({
                message: 'Quantity must be a positive integer',
            })
            .optional(),
        price: z
            .object(
                {
                    amount: z.number({
                        invalid_type_error: 'price amount must be a number',
                        required_error: 'Price is required',
                    }),
                    discount: z
                        .number({
                            invalid_type_error:
                                'Discount amount must be a number',
                            required_error: 'Discount is required',
                        })
                        .nonnegative({
                            message: 'Discount amount is required',
                        })
                        .optional()
                        .default(0),
                    discount_type: z
                        .enum(['flat', 'percent'], {
                            message: 'Discount type must be flat or percent',
                        })
                        .optional()
                        .default('flat'),
                },
                {
                    message: 'Price must be object',
                },
            )
            .optional(),
        thumb_image: z
            .string({
                invalid_type_error: 'Thumb image must be a string',
                required_error: 'Thumb is required',
            })
            .optional(),
        category: z
            .string({
                invalid_type_error: 'category id must be string',
                required_error: 'category id is required',
            })
            .optional(),
    }),
});
const postProductPaymentSchema = z.object({
    body: z.object({
        method: z.enum(['stripe', 'paypal', 'razorpay'], {
            message: 'Payment method should be stripe | paypal | razorpay',
        }),
    }),
});
const updateProductOrderSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'ID must be a string',
                required_error: 'Id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Product id is invalid',
            }),
        status: z.enum(['pending', 'accepted', 'cancelled'], {
            message: 'status must be accepted or cancelled or pending',
        }),
    }),
});
export const ProductValidations = {
    postProductValidationSchema,
    updateProductValidationSchema,
    postProductPaymentSchema,
    updateProductOrderSchema,
};
