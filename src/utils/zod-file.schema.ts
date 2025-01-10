import { z } from 'zod';

export const fileSchema = z.object({
  originalname: z.string().min(1, 'File name is required'),
  mimetype: z.string().regex(/image\/(png|jpeg|jpg)/, 'Invalid file type'),
  size: z.number().max(5000000, 'File size exceeds the limit of 5MB'),
});
