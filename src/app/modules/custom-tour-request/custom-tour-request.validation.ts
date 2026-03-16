import { z } from 'zod';

const createCustomTourRequestValidation = z.object({
  body: z.object({
    selectedDestination: z.string().trim().optional(),
    customDestination: z.string().trim().optional(),
    travelDate: z.string().optional(),
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(1, 'First name cannot be empty')
      .trim(),
    lastName: z.string().trim().optional(),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number cannot be empty')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim(),
    requirements: z.string().trim().optional(),
  }),
});

const updateCustomTourRequestValidation = z.object({
  body: z.object({
    selectedDestination: z.string().trim().optional(),
    customDestination: z.string().trim().optional(),
    travelDate: z.string().optional(),
    firstName: z.string().min(1).trim().optional(),
    lastName: z.string().trim().optional(),
    phone: z.string().min(1).trim().optional(),
    email: z.string().email().trim().optional(),
    requirements: z.string().trim().optional(),
    status: z.enum(['pending', 'contacted', 'resolved']).optional(),
  }),
});

export const CustomTourRequestValidation = {
  createCustomTourRequestValidation,
  updateCustomTourRequestValidation,
};
