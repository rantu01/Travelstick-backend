import { z } from 'zod';
import { Types } from 'mongoose';

const postHRMValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Role name must be string',
                required_error: 'Role name is required',
            })
            .min(1, {
                message: 'Role name is required',
            })
            .max(50, {
                message:
                    'Role name must be less than or equal to 50 characters',
            })
            .trim(),
        deletable: z
            .boolean({
                invalid_type_error: 'Role deletable must be boolean',
                required_error: 'Role deletable is required',
            })
            .default(true)
            .optional(),
        permissions: z
            .array(
                z.string({
                    invalid_type_error: 'Role permissions must be string',
                    required_error: 'Role permissions must be string',
                }),
                {
                    message: 'Role permissions must be array',
                },
            )
            .optional(),
    }),
});

const updateHRMValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Role id must be string',
                required_error: 'Role id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data)),
        name: z
            .string({
                invalid_type_error: 'Role name must be string',
                required_error: 'Role name is required',
            })
            .max(50, {
                message:
                    'Role name must be less than or equal to 50 characters',
            })
            .trim()
            .optional(),
        deletable: z
            .boolean({
                invalid_type_error: 'Role deletable must be boolean',
                required_error: 'Role deletable is required',
            })
            .optional(),
        permissions: z
            .array(
                z.string({
                    invalid_type_error: 'Role permissions must be string',
                    required_error: 'Role permissions must be string',
                }),
                {
                    message: 'Role permissions must be array',
                },
            )
            .optional(),
    }),
});
const updateHRMPermissionValidationSchema = z.object({
    body: z.object({
        role: z
            .string({
                invalid_type_error: 'Role id must be string',
                required_error: 'Role id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Role is must be valid',
            }),
        permissions: z
            .array(
                z.string({
                    invalid_type_error: 'Role permissions must be string',
                    required_error: 'Role permissions must be string',
                }),
                {
                    message: 'Role permissions must be array',
                },
            )
            .optional(),
    }),
});

export const HRMRoleValidations = {
    postHRMValidationSchema,
    updateHRMValidationSchema,
    updateHRMPermissionValidationSchema,
};
