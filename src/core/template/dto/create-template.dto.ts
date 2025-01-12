import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string(),
  tempImg: z.string().url(),
  description: z.string(),
});

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
