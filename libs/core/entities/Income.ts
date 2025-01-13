import { z } from 'zod';
import { wallet, fund } from 'core/shared/schemas';
import { tagSchema } from './Tag';
import { userSchema } from './User';
import { fundSchema } from './Fund';
import { walletSchema } from './Wallet';

export const incomeSchema = z.intersection(
  z.object({
    id: z.string(),
    userId: userSchema.shape.id,
    note: z.string().nullable(),
    amount: z.number().positive(),
    date: z.number().int(),
    tags: tagSchema.shape.id.array(),
  }),
  z.union([
    z.object({
      entity: z.literal(fund),
      entityId: fundSchema.shape.id,
    }),
    z.object({
      entity: z.literal(wallet),
      entityId: walletSchema.shape.id,
    }),
  ]),
);

export type Income = z.infer<typeof incomeSchema>;
