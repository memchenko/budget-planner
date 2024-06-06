import * as z from 'zod';

export const UserSchema = z.object({
  tgId: z.string(),
  balance: z.number(),
});

export type User = z.infer<typeof UserSchema>;
