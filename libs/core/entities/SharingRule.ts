import { z } from 'zod';
import { allEntities } from 'core/shared/schemas';
import { userSchema } from './User';

export const sharingRuleSchema = z.object({
  id: z.string(),
  ownerId: userSchema.shape.id,
  // user who I allow to act on my entity
  userId: userSchema.shape.id,
  entityId: z.string().nullable(),
  entity: allEntities,
  relatedEntities: allEntities.array(),
  // TODO add permissions
});

export type SharingRule = z.infer<typeof sharingRuleSchema>;
