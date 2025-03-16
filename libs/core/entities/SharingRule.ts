import { z } from 'zod';
import { wallet, fund, tag } from 'core/shared/schemas';
import { userSchema } from './User';

export const sharingRuleSchema = z.intersection(
  z.object({
    id: z.string(),
    ownerId: userSchema.shape.id,
    // user who I allow to act on my entity
    userId: userSchema.shape.id,
    entityId: z.string().nullable(),
  }),
  z.union([
    z.object({
      entity: z.literal(wallet),
      actions: z.enum(['list', 'read-balance']).array(),
    }),
    z.object({
      entity: z.literal(fund),
      actions: z.enum(['list', 'read-balance', 'write-cost']).array(),
    }),
    z.object({
      entity: z.literal(tag),
      actions: z.enum(['list']).array(),
    }),
  ]),
);

export type SharingRule = z.infer<typeof sharingRuleSchema>;
