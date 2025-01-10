import { z } from 'zod';

export const updateResumeSchema = z.object({
  templateId: z.string().optional(),
  title: z.string().optional(),
});

export type UpdateResumeDto = z.infer<typeof updateResumeSchema>;
