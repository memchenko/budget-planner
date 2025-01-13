import { z } from 'zod';

export const allEntities = z.enum([
  'user',
  'fund',
  'wallet',
  'cost',
  'income',
  'tag',
  'sharingRule',
  'synchronizationOrder',
]);

export const { user, fund, wallet, cost, income, tag, sharingRule, synchronizationOrder } = allEntities.Enum;
