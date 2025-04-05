import { z } from 'zod';
import {
  userSchema,
  fundSchema,
  walletSchema,
  costSchema,
  incomeSchema,
  tagSchema,
  sharingRuleSchema,
  synchronizationOrderSchema,
} from 'core/entities';
import { user, fund, wallet, cost, income, tag, sharingRule, synchronizationOrder } from './schemas';

export const entitySchemaMap = {
  [user]: userSchema,
  [fund]: fundSchema,
  [wallet]: walletSchema,
  [cost]: costSchema,
  [income]: incomeSchema,
  [tag]: tagSchema,
  [sharingRule]: sharingRuleSchema,
  [synchronizationOrder]: synchronizationOrderSchema,
} as const;

export type EntityMap = {
  [K in keyof typeof entitySchemaMap]: z.infer<(typeof entitySchemaMap)[K]>;
};
