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

// User entity scenarios
export { CreateUser } from './user/CreateUser';

export const DeleteUser = buildDeleteEntityScenario<User>({
  entityName: ENTITY_NAME.USER,
  repoType: TOKENS.UserRepo,
});

// Tag entity scenarios
export const CreateTag = buildCreateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TOKENS.TagRepo,
});

export const UpdateTag = buildUpdateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TOKENS.TagRepo,
});

export { DeleteCostTag } from '#/libs/core/scenarios/tag/DeleteCostTag';

export { DeleteIncomeTag } from '#/libs/core/scenarios/tag/DeleteIncomeTag';

// Fund entity scenarios
export { DistributeBalance } from './fund/DistributeBalance';

export const CreateFund = buildCreateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FundRepo,
});

export const UpdateFund = buildUpdateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FundRepo,
});

export { DeleteFund } from './fund/DeleteFund';

// Transactions scenarios
export { AddCost } from './cost/AddCost';

export { AddIncome } from './income/AddIncome';

// Wallet entity scenarios
export const CreateWallet = buildCreateEntityScenario<Wallet>({
  entityName: ENTITY_NAME.WALLET,
  repoType: TOKENS.WalletRepo,
});

export const UpdateWallet = buildUpdateEntityScenario<Wallet>({
  entityName: ENTITY_NAME.WALLET,
  repoType: TOKENS.WalletRepo,
});
