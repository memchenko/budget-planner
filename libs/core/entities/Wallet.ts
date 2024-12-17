import { z } from 'zod';

import { userSchema } from './User';

export const walletSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  title: z.string(),
  balance: z.number(),
});

export type Wallet = z.infer<typeof walletSchema>;
