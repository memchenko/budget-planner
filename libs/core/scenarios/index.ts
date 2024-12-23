import {
  buildCreateEntityScenario,
  buildDeleteEntityScenario,
  buildUpdateEntityScenario,
} from '#/libs/core/shared/factories';
import { ENTITY_NAME } from '#/libs/core/shared/constants';
import { TOKENS } from '#/libs/core/types';
import { User } from '#/libs/core/entities/User';
import { Tag } from '#/libs/core/entities/Tag';
import { Fund } from '#/libs/core/entities/Fund';
import { Wallet } from '#/libs/core/entities/Wallet';
import { SharingRule } from '#/libs/core/entities/SharingRule';

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

export { DeleteCostTag } from '#/libs/core/scenarios/tag/DeleteCostTag';

export { DeleteIncomeTag } from '#/libs/core/scenarios/tag/DeleteIncomeTag';

// Fund entity scenarios
export { DistributeBalance } from './DistributeBalance';

export const CreateFund = buildCreateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FUND_REPO,
});

export const UpdateFund = buildUpdateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FUND_REPO,
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
export const CreateSharingRule = buildCreateEntityScenario<SharingRule>({
  entityName: ENTITY_NAME.SHARING_RULE,
  repoType: TOKENS.SHARING_RULE,
});

export const UpdateSharingRule = buildUpdateEntityScenario<SharingRule>({
  entityName: ENTITY_NAME.SHARING_RULE,
  repoType: TOKENS.SHARING_RULE,
});

export const DeleteSharingRule = buildDeleteEntityScenario({
  entityName: ENTITY_NAME.SHARING_RULE,
  repoType: TOKENS.SHARING_RULE,
});
