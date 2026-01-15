import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';
const postProviderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .min(1, {
                message: 'Name is required',
            })
            .max(50, {
                message: 'Name must be less than 50 characters',
            }),
        about: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'About is required',
                        invalid_type_error: 'About is required',
                    })
                    .max(500, {
                        message: 'About must be less than 500 characters',
                    }),
            )
            .optional(),
        specialists: z
            .array(
                z.string({
                    invalid_type_error: 'Specialist must be string',
                    required_error: 'Specialist is required',
                }),
                { message: 'specialists must be an array' },
            )
            .nonempty({
                message: 'Please must be provide one specialists',
            }),
        qualifications: z.array(
            z
                .string({
                    invalid_type_error: 'qualification must be string',
                    required_error: 'qualification is required',
                })
                .max(255, {
                    message: 'qualification must be less then or equal to 255',
                }),
            { message: 'qualifications must be an array' },
        ),
        personal_info: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'personal info is required',
                        invalid_type_error: 'personal must be string',
                    })
                    .max(5000, {
                        message:
                            'personal info must be less than 5000 characters',
                    }),
            )
            .optional(),
        professional_info: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Professional info is required',
                        invalid_type_error: 'Professional  must be string',
                    })
                    .max(5000, {
                        message:
                            'Professional info must be less than 5000 characters',
                    }),
            )
            .optional(),
        image: z.string({
            required_error: 'Image is required',
            invalid_type_error: 'Image must be string',
        }),
        email: z
            .string({
                required_error: 'Email is required',
                invalid_type_error: 'Email must be string',
            })
            .email({
                message: 'Email must be valid email',
            })
            .optional(),
        phone: z
            .string({
                required_error: 'Phone is required',
                invalid_type_error: 'Phone must be string',
            })
            .optional(),
        x_url: z
            .string({
                required_error: 'X-Url is required',
                invalid_type_error: 'X-Url must be string',
            })
            .url({
                message: 'X-Url must be valid',
            })
            .optional(),
        facebook_url: z
            .string({
                required_error: 'Facebook url is required',
                invalid_type_error: 'Facebook url must be string',
            })
            .url({
                message: 'Facebook url must be valid',
            })
            .optional(),
        instagram_url: z
            .string({
                required_error: 'Instagram url is required',
                invalid_type_error: 'Instagram url must be string',
            })
            .url({
                message: 'Instagram url must be valid',
            })
            .optional(),
        linkedin_url: z
            .string({
                required_error: 'Linkedin url is required',
                invalid_type_error: 'Linkedin url must be string',
            })
            .url({
                message: 'Linkedin url must be valid',
            })
            .optional(),
    }),
});

const updateProviderValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                required_error: 'provider id is required',
                invalid_type_error: 'provider _d must be string',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Provider id must be valid',
            }),
        name: z
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .min(1, {
                message: 'Name is required',
            })
            .max(50, {
                message: 'Name must be less than 50 characters',
            })
            .optional(),
        about: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'About is required',
                        invalid_type_error: 'About is required',
                    })
                    .max(500, {
                        message: 'About must be less than 500 characters',
                    }),
            )
            .optional(),
        specialists: z
            .array(
                z.string({
                    invalid_type_error: 'Specialist must be string',
                    required_error: 'Specialist is required',
                }),
                { message: 'specialists must be an array' },
            )
            .nonempty({
                message: 'Please must be provide one specialists',
            })
            .optional(),
        qualifications: z
            .array(
                z
                    .string({
                        invalid_type_error: 'qualification must be string',
                        required_error: 'qualification is required',
                    })
                    .max(255, {
                        message:
                            'qualification must be less then or equal to 255',
                    }),
                { message: 'qualifications must be an array' },
            )
            .optional(),
        expert: z
            .string({
                required_error: 'Expert is required',
                invalid_type_error: 'Expert is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Expert  must be valid id',
            })
            .optional(),
        personal_info: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'personal info is required',
                        invalid_type_error: 'personal must be string',
                    })
                    .max(5000, {
                        message:
                            'personal info must be less than 5000 characters',
                    }),
            )
            .optional(),
        professional_info: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Professional info is required',
                        invalid_type_error: 'Professional  must be string',
                    })
                    .max(5000, {
                        message:
                            'Professional info must be less than 5000 characters',
                    }),
            )
            .optional(),
        image: z
            .string({
                required_error: 'Image is required',
                invalid_type_error: 'Image must be string',
            })
            .optional(),
        email: z
            .string({
                required_error: 'Email is required',
                invalid_type_error: 'Email must be string',
            })
            .email({
                message: 'Email must be valid email',
            })
            .optional(),
        phone: z
            .string({
                required_error: 'Phone is required',
                invalid_type_error: 'Phone must be string',
            })
            .optional(),
        x_url: z
            .string({
                required_error: 'X-Url is required',
                invalid_type_error: 'X-Url must be string',
            })
            .url({
                message: 'X-Url must be valid',
            })
            .optional(),
        facebook_url: z
            .string({
                required_error: 'Facebook url is required',
                invalid_type_error: 'Facebook url must be string',
            })
            .url({
                message: 'Facebook url must be valid',
            })
            .optional(),
        instagram_url: z
            .string({
                required_error: 'Instagram url is required',
                invalid_type_error: 'Instagram url must be string',
            })
            .url({
                message: 'Instagram url must be valid',
            })
            .optional(),
        linkedin_url: z
            .string({
                required_error: 'Linkedin url is required',
                invalid_type_error: 'Linkedin url must be string',
            })
            .url({
                message: 'Linkedin url must be valid',
            })
            .optional(),
    }),
});

export const ProviderValidations = {
    postProviderValidationSchema,
    updateProviderValidationSchema,
};
