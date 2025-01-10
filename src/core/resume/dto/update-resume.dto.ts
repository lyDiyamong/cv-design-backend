import { z } from 'zod';

export const updateResumeSchema = z.object({
  userId: z.string().nonempty(),
  templateId: z.string().nonempty(),
  title: z.string().nonempty(),
  previewImg: z.string().nonempty(),
});

export type UpdateResumeDto = z.infer<typeof updateResumeSchema>;
