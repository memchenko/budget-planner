import { z } from 'zod';
import { cost, income, fund, wallet } from 'core/shared/schemas';
import { fundSchema } from './Fund';
import { walletSchema } from './Wallet';
import { userSchema } from './User';

export const tagSchema = z.object({
  id: z.string(),
  userId: userSchema.shape.id,
  type: z.enum([cost, income]),
  title: z.string(),
  entities: z
    .union([
      z.object({
        entity: z.literal(fund),
        entityId: fundSchema.shape.id,
      }),
      z.object({
        entity: z.literal(wallet),
        entityId: walletSchema.shape.id,
      }),
    ])
    .array(),
});

export type Tag = z.infer<typeof tagSchema>;
