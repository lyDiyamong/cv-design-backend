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
    dateOfBirth: z.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpDto = z.infer<typeof signUpSchema>;

export const updateUser = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.coerce.date({
    required_error: 'Please select a date and time',
    invalid_type_error: "That's not a valid date!",
  }),
});

export type UpdateUserDto = z.infer<typeof updateUser>;
