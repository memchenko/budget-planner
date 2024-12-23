import { z } from 'zod';

import { userSchema } from './User';

export const sharingRuleSchema = z.intersection(
  z.object({
    id: z.string(),
    // user who I allow to act on my entity
    userId: userSchema.shape.id,
    entityId: z.string().nullable(),
  }),
  z.union([
    z.object({
      entity: z.literal('wallet'),
      actions: z.enum(['list', 'read-balance']).array(),
    }),
    z.object({
      entity: z.literal('fund'),
      actions: z.enum(['list', 'read-balance', 'write-cost']).array(),
    }),
  ]),
);

export type SharingRule = z.infer<typeof sharingRuleSchema>;
