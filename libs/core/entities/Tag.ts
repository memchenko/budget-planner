import { z } from 'zod';
import { cost, income } from '#/libs/core/shared/schemas';
import { userSchema } from './User';

export const tagSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  type: z.enum([cost, income]),
  title: z.string(),
});

export type Tag = z.infer<typeof tagSchema>;
