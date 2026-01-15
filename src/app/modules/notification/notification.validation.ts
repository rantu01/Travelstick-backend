import { z } from 'zod';
import { Types } from 'mongoose';

const updateNotificationValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Role id must be string',
                required_error: 'Role id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data)),
        is_read: z.boolean({
            invalid_type_error: 'is_read must be boolean',
            required_error: 'is_read is required',
        }),
    }),
});

export const NotificationValidations = {
    updateNotificationValidationSchema,
};
