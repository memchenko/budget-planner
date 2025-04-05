import { z } from 'zod';
import { allEntities } from 'core/shared/schemas';
import { userSchema } from './User';

export const synchronizationOrderSchema = z.object({
  id: z.string(),
  entity: allEntities,
  entityId: z.string(),
  userId: userSchema.shape.id,
  action: z.enum(['create', 'update', 'delete']),
});

export type SynchronizationOrder = z.infer<typeof synchronizationOrderSchema>;
