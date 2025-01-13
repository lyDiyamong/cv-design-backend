import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.coerce.date({
    required_error: 'Please select a date and time',
    invalid_type_error: "That's not a valid date!",
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
