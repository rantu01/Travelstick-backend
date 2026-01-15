import z from 'zod';
import mongoose from 'mongoose';
const postTestimonialValidationSchema = z.object({
    body: z.object({
        rating: z
            .number({
                invalid_type_error: 'Rating must be number',
                required_error: 'Rating is required',
            })
            .gte(1, {
                message: 'Rating must be greater than 0',
            })
            .lte(5, {
                message: 'Rating must be less than or equal to 5',
            }),
        comment: z
            .string({
                invalid_type_error: 'comment must be string',
                required_error: 'comment is required',
            })
            .max(255, {
                message: 'comment length must be less  than 255 characters',
            })
            .optional(),
    }),
});
const updateTestimonialValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                required_error: 'Testimonial _id must be required',
                invalid_type_error: 'Testimonial id must be string',
            })
            .refine((data) => mongoose.Types.ObjectId.isValid(data), {
                message: 'Testimonial id must be valid',
            }),
        status: z.boolean({
            invalid_type_error: 'Status must be boolean',
            required_error: 'Status is required',
        }),
    }),
});
export const TestimonialValidations = {
    postTestimonialValidationSchema,
    updateTestimonialValidationSchema,
};
