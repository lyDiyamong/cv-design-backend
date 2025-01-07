import { z } from 'zod';

// Log in schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email').nonempty('Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password cannot exceed 20 characters'),
  userAgent: z.string().optional(),
});
export type LoginDto = z.infer<typeof loginSchema>;

// User schema & DTO
export const signUpSchema = loginSchema
  .extend({
    firstName: z.string().nonempty('First name is required'),
    lastName: z.string().nonempty('Last name is required'),
    gender: z.enum(['Male', 'Female']),
    imgUrl: z.string().optional(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpDto = z.infer<typeof signUpSchema>;
