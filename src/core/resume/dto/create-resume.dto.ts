import { z } from 'zod';

export const createResumeSchema = z.object({
  title: z.string().nonempty(),
  previewImg: z.string().nonempty(),
});

export type CreateResumeDto = z.infer<typeof createResumeSchema>;
