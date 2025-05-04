import { buildCreateEntityScenario, buildDeleteEntityScenario, buildUpdateEntityScenario } from 'core/shared/factories';
import { ENTITY_NAME } from 'core/shared/constants';
import { TOKENS } from 'core/types';
import { User } from 'core/entities/User';
import { Tag } from 'core/entities/Tag';
import { SharingRule } from 'core/entities/SharingRule';
import { SynchronizationOrder } from 'core/entities/SynchronizationOrder';

// User entity scenarios
export { CreateUser } from './user/CreateUser';

export const DeleteUser = buildDeleteEntityScenario<User>({
  entityName: ENTITY_NAME.USER,
  repoType: TOKENS.USER_REPO,
});

export const UpdateUser = buildUpdateEntityScenario<User>({
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

export { AssignTagToEntity } from './tag/AssignTagToEntity';

// Fund entity scenarios
export { DistributeBalance } from './DistributeBalance';

export { CreateFund, UpdateFund, DeleteFund } from './fund';

// Transactions scenarios
export { AddCost } from './cost/AddCost';

export { AddIncome } from './income/AddIncome';

export { CreateWallet, UpdateWallet } from './wallet';

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

export { CalculateFunds } from './CalculateFunds';
