import { buildCreateEntityScenario, buildDeleteEntityScenario, buildUpdateEntityScenario } from '../shared/factories';
import { ENTITY_NAME } from '../shared/constants';
import { TOKENS } from '../types';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';
import { Fund } from '../entities/Fund';

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

export { DeleteCostTag } from '../scenarios/tag/DeleteCostTag';

export { DeleteIncomeTag } from '../scenarios/tag/DeleteIncomeTag';

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
