import { z } from 'zod';
import { wallet, fund } from '#/libs/core/shared/schemas';
import { userSchema } from './User';
import { fundSchema } from './Fund';
import { walletSchema } from './Wallet';

export const incomeSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  entity: z.enum([wallet, fund]),
  entityId: fundSchema.shape.id.or(walletSchema.shape.id),
  note: z.string().nullable(),
  amount: z.number().positive(),
  date: z.number().int(),
});

export type Income = z.infer<typeof incomeSchema>;
