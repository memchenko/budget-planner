import { z } from 'zod';

export * from './Cost';
export * from './Fund';
export * from './Income';
export * from './Tag';
export * from './User';
export * from './Wallet';
export * from './SharingRule';
export * from './SynchronizationOrder';

import { user, wallet, fund, tag, income, cost, sharingRule, synchronizationOrder } from 'core/shared/schemas';
import { costSchema } from './Cost';
import { fundSchema } from './Fund';
import { incomeSchema } from './Income';
import { tagSchema } from './Tag';
import { userSchema } from './User';
import { walletSchema } from './Wallet';
import { sharingRuleSchema } from './SharingRule';
import { synchronizationOrderSchema } from './SynchronizationOrder';

export const entitySchemaMap = {
  [user]: userSchema,
  [wallet]: walletSchema,
  [fund]: fundSchema,
  [tag]: tagSchema,
  [income]: incomeSchema,
  [cost]: costSchema,
  [sharingRule]: sharingRuleSchema,
  [synchronizationOrder]: synchronizationOrderSchema,
} as const;

export type EntityMap = {
  [K in keyof typeof entitySchemaMap]: z.infer<(typeof entitySchemaMap)[K]>;
};
