import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatarSrc: z.string(),
});

export type User = z.infer<typeof userSchema>;
