import { z } from 'zod';

const createUmrahInquiryValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name cannot be empty').trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim(),
    phone: z.string().trim().optional(),
    reachBy: z.enum(['WhatsApp', 'Phone Call', 'Email']).default('WhatsApp'),
    question: z.string().trim().optional(),
    topics: z.array(z.string()).optional(),
  }),
});

const updateUmrahInquiryValidation = z.object({
  body: z.object({
    name: z.string().min(1).trim().optional(),
    email: z.string().email().trim().optional(),
    phone: z.string().trim().optional(),
    reachBy: z.enum(['WhatsApp', 'Phone Call', 'Email']).optional(),
    question: z.string().trim().optional(),
    topics: z.array(z.string()).optional(),
    status: z.enum(['pending', 'in-progress', 'resolved']).optional(),
  }),
});

export const UmrahInquiryValidation = {
  createUmrahInquiryValidation,
  updateUmrahInquiryValidation,
};