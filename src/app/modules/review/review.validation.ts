import z from 'zod';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
const postReviewValidationSchema = z.object({
    body: z.object({
        location: z
            .number({
                invalid_type_error: 'location rating must be number',
                required_error: 'location rating is required',
            })
            .gte(1, {
                message: 'location rating must be greater than 0',
            })
            .lte(5, {
                message: 'location rating must be less than or equal to 5',
            })
            .default(3),
        service: z
            .number({
                invalid_type_error: 'service rating must be number',
                required_error: 'service rating is required',
            })
            .gte(1, {
                message: 'service rating must be greater than 0',
            })
            .lte(5, {
                message: 'service rating must be less than or equal to 5',
            })
            .default(3),
        amenities: z
            .number({
                invalid_type_error: 'amenities rating must be number',
                required_error: 'amenities rating is required',
            })
            .gte(1, {
                message: 'amenities rating must be greater than 0',
            })
            .lte(5, {
                message: 'amenities rating must be less than or equal to 5',
            })
            .default(3),
        price: z
            .number({
                invalid_type_error: 'price rating must be number',
                required_error: 'price rating is required',
            })
            .gte(1, {
                message: 'price rating must be greater than 0',
            })
            .lte(5, {
                message: 'price rating must be less than or equal to 5',
            })
            .default(3),
        room: z
            .number({
                invalid_type_error: 'room rating must be number',
                required_error: 'room rating is required',
            })
            .gte(1, {
                message: 'room rating must be greater than 0',
            })
            .lte(5, {
                message: 'room rating must be less than or equal to 5',
            })
            .default(3),
        comment: z
            .string({
                invalid_type_error: 'comment must be string',
                required_error: 'comment is required',
            })
            .max(255, {
                message: 'comment length must be less  than 255 characters',
            })
            .optional(),
        package: z
            .string({
                invalid_type_error: 'package id is required',
                required_error: 'package id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'package id must be valid.',
            })
            .optional(),
        hotel: z
            .string({
                invalid_type_error: 'hotel id is required',
                required_error: 'hotel id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'hotel id must be valid.',
            })
            .optional(),
    }),
});
const updateReviewValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Product id must be string',
                required_error: 'product id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Product id must be valid.',
            }),
        status: z.boolean({
            invalid_type_error: 'Rating must be boolean',
            required_error: 'Rating is required',
        }),
    }),
});
const postReplayValidationSchema = z.object({
    body: z.object({
        package_review: z
            .string({
                invalid_type_error: 'package_review must be a string',
                required_error: 'package_review is required',
            })
            .refine((data) => ObjectId.isValid(data), {
                message: 'package_review is invalid',
            }),
        comment: z.string({
            invalid_type_error: 'comment must be a string',
            required_error: 'comment is required',
        }),
    }),
});
export const ReviewPackageValidations = {
    postReviewValidationSchema,
    updateReviewValidationSchema,
    postReplayValidationSchema,
};
