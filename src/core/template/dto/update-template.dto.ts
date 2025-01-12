import { z } from 'zod';

export const updateTemplateSchema = z.object({
  name: z.string().optional(),
  tempImg: z.string().url().optional(),
  description: z.string().optional(),
});

export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;
