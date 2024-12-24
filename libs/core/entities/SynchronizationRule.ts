import { z } from 'zod';
import { userSchema } from './User';
import { fund, cost, income, tag } from '#/libs/core/shared/schemas';

export const synchronizationRuleSchema = z.object({
  id: z.string(),
  entity: z.enum([fund, cost, income, tag]),
  entityId: z.string(),
  userId: userSchema.shape.id,
  action: z.enum(['create', 'update', 'delete']),
});

export type SynchronizationRule = z.infer<typeof synchronizationRuleSchema>;
