import { z } from 'zod';

export const createResumeSchema = z.object({
  templateId: z.string().nonempty(),
  title: z.string().nonempty(),
});

export type CreateResumeDto = z.infer<typeof createResumeSchema>;
