import { z } from 'zod';
import mongoose from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postDestinationValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .max(255, {
                message: 'Name must be at least 255 characters',
            }),
        short_description: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Sort description is required',
                    invalid_type_error: 'Sort description is required',
                })
                .max(255, {
                    message: 'Sort description must be at least 255 characters',
                }),
            {
                message: 'Sort description must be object',
            },
        ),
        description: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Description is required',
                    invalid_type_error: 'Description is required',
                })
                .max(10000, {
                    message: 'Description must be at least 10000 characters',
                }),
            {
                message: 'Description must be object',
            },
        ),
        card_image: z.string({
            required_error: 'Card image is required',
            invalid_type_error: 'Card image must be string',
        }),
        banner_image: z.string({
            required_error: 'Banner image is required',
            invalid_type_error: 'Banner image must be string',
        }),
        images: z
            .array(
                z.string({
                    required_error: 'Image is required',
                    invalid_type_error: 'Image must be string',
                }),
                {
                    message: 'image must ba array',
                },
            )
            .optional(),
        video_url: z
            .string({
                required_error: 'Video URL is required',
                invalid_type_error: 'Video URL must be string',
            })
            .optional(),
        capital: z.string({
            required_error: 'Capital is required',
            invalid_type_error: 'Capital must be string',
        }),
        language: z.string({
            required_error: 'Language is required',
            invalid_type_error: 'Language must be string',
        }),
        currency: z.string({
            required_error: 'Capital is required',
            invalid_type_error: 'Capital must be string',
        }),

        address: z.object({
            name: z.string({
                required_error: 'Address is required',
                invalid_type_error: 'Address must be string',
            }),
            lat: z.number({
                required_error: 'Latitude is required',
                invalid_type_error: 'Latitude is required',
            }),
            lng: z.number({
                required_error: 'Longitude is required',
                invalid_type_error: 'Longitude is required',
            }),
        }),
    }),
});
const updateDestinationValidationSchema = z.object({
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
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .max(255, {
                message: 'Name must be at least 255 characters',
            })
            .optional(),
        short_description: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Sort description is required',
                        invalid_type_error: 'Sort description is required',
                    })
                    .max(255, {
                        message:
                            'Sort description must be at least 255 characters',
                    }),
                {
                    message: 'Sort description must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Description is required',
                        invalid_type_error: 'Description is required',
                    })
                    .max(10000, {
                        message:
                            'Description must be at least 10000 characters',
                    }),
                {
                    message: 'Description must be object',
                },
            )
            .optional(),
        card_image: z
            .string({
                required_error: 'Card image is required',
                invalid_type_error: 'Card image must be string',
            })
            .optional(),
        banner_image: z
            .string({
                required_error: 'Banner image is required',
                invalid_type_error: 'Banner image must be string',
            })
            .optional(),
        images: z
            .array(
                z.string({
                    required_error: 'Image is required',
                    invalid_type_error: 'Image must be string',
                }),
                {
                    message: 'image must ba array',
                },
            )
            .optional(),
        video_url: z
            .string({
                required_error: 'Video URL is required',
                invalid_type_error: 'Video URL must be string',
            })
            .optional(),
        capital: z
            .string({
                required_error: 'Capital is required',
                invalid_type_error: 'Capital must be string',
            })
            .optional(),
        language: z
            .string({
                required_error: 'Language is required',
                invalid_type_error: 'Language must be string',
            })
            .optional(),
        currency: z
            .string({
                required_error: 'Capital is required',
                invalid_type_error: 'Capital must be string',
            })
            .optional(),

        address: z
            .object({
                name: z.string({
                    required_error: 'Address is required',
                    invalid_type_error: 'Address must be string',
                }),
                lat: z.number({
                    required_error: 'Latitude is required',
                    invalid_type_error: 'Latitude is required',
                }),
                lng: z.number({
                    required_error: 'Longitude is required',
                    invalid_type_error: 'Longitude is required',
                }),
            })
            .optional(),
        status: z
            .boolean({
                invalid_type_error: 'Status must be boolean',
                required_error: 'Status is required',
            })
            .optional(),
    }),
});
export const DestinationValidations = {
    postDestinationValidationSchema,
    updateDestinationValidationSchema,
};
