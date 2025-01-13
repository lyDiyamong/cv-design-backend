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
