import { z } from 'zod';
import { ObjectId } from 'mongodb';

const postCartValidationSchema = z.object({
    body: z.object({
        product: z
            .string({
                required_error: 'product is required',
                invalid_type_error: 'product must be string',
            })
            .refine((data) => ObjectId.isValid(data), {
                message: 'product is invalid',
            }),
        quantity: z.number({
            required_error: 'quantity is required',
            invalid_type_error: 'quantity must be number',
        }),
    }),
});
export const CartValidations = {
    postCartValidationSchema,
};
