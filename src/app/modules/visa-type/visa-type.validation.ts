import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';
import VisaType from './visa-type.model';

const postVisaTypeValidationSchema = z.object({
    body: z.object({
        name: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Name must be string',
                    required_error: 'Name is required',
                })
                .min(1, {
                    message: 'Name is required',
                })
                .max(255, {
                    message:
                        'Name must be less than or equal to 255 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Name must be object',
            },
        ),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Description must be string',
                        required_error: 'Description is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'Description must be object',
                },
            )
            .optional(),
    }),
});
const updateVisaTypeValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'id must be string',
                required_error: 'id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        name: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Name must be string',
                        required_error: 'Name is required',
                    })
                    .min(1, {
                        message: 'Name is required',
                    })
                    .max(255, {
                        message:
                            'Name must be less than or equal to 255 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Name must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Description must be string',
                        required_error: 'Description is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'Description must be object',
                },
            )
            .optional(),
        status: z
            .boolean({
                required_error: 'status is required',
                invalid_type_error: 'status must be boolean',
            })
            .optional(),
    }),
});
export const VisaTypeValidations = {
    postVisaTypeValidationSchema,
    updateVisaTypeValidationSchema,
};
