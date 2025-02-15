import { buildCreateEntityScenario, buildDeleteEntityScenario, buildUpdateEntityScenario } from 'core/shared/factories';
import { ENTITY_NAME } from 'core/shared/constants';
import { TOKENS } from 'core/types';
import { User } from 'core/entities/User';
import { Tag } from 'core/entities/Tag';
import { Fund } from 'core/entities/Fund';
import { Wallet } from 'core/entities/Wallet';
import { SharingRule } from 'core/entities/SharingRule';
import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';
import { fund } from 'core/shared/schemas';

// User entity scenarios
export { CreateUser } from './user/CreateUser';

export const DeleteUser = buildDeleteEntityScenario<User>({
  entityName: ENTITY_NAME.USER,
  repoType: TOKENS.USER_REPO,
});

// Tag entity scenarios
export const CreateTag = buildCreateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TOKENS.TAG_REPO,
});

export const UpdateTag = buildUpdateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TOKENS.TAG_REPO,
});

// Fund entity scenarios
export { DistributeBalance } from './DistributeBalance';

export const CreateFund = buildCreateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FUND_REPO,
});

export const UpdateFund = buildUpdateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FUND_REPO,
  sharingRuleEntityName: fund,
});

export { DeleteFund } from './fund/DeleteFund';

// Transactions scenarios
export { AddCost } from './cost/AddCost';

export { AddIncome } from './income/AddIncome';

// Wallet entity scenarios
export const CreateWallet = buildCreateEntityScenario<Wallet>({
  entityName: ENTITY_NAME.WALLET,
  repoType: TOKENS.WALLET_REPO,
});

export const UpdateWallet = buildUpdateEntityScenario<Wallet>({
  entityName: ENTITY_NAME.WALLET,
  repoType: TOKENS.WALLET_REPO,
});

// Sharing scenarios
export { AddSharingRule } from './sharing/AddSharingRule';

export const UpdateSharingRule = buildUpdateEntityScenario<SharingRule>({
  entityName: ENTITY_NAME.SHARING_RULE,
  repoType: TOKENS.SHARING_RULE_REPO,
});

export { DeleteSharingRule } from './sharing/DeleteSharingRule';

// Synchronization
export { AddSynchronizationOrder } from './AddSynchronizationOrder';

export const DeleteSynchronizationOrder = buildDeleteEntityScenario<SynchronizationOrder>({
  entityName: ENTITY_NAME.SYNCHRONIZATION_ORDER,
  repoType: TOKENS.SYNCHRONIZATION_ORDER_REPO,
});

export { SendMoneyToPeer } from './SendMoneyToPeer';
