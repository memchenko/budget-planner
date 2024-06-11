import { buildCreateEntityScenario, buildDeleteEntityScenario, buildUpdateEntityScenario } from '../shared/factories';
import { ENTITY_NAME } from '../shared/constants';
import { TYPES } from '../types';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';
import { Fund } from '../entities/Fund';

// User entity scenarios
export { CreateUser } from './user/CreateUser';

export const DeleteUser = buildDeleteEntityScenario<User>({
  entityName: ENTITY_NAME.USER,
  repoType: TYPES.UserRepo,
});

// Tag entity scenarios
export const CreateTag = buildCreateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TYPES.TagRepo,
});

export const UpdateTag = buildUpdateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TYPES.TagRepo,
});

export { DeleteCostTag } from '../scenarios/tag/DeleteCostTag';

export { DeleteIncomeTag } from '../scenarios/tag/DeleteIncomeTag';

// Fund entity scenarios
export { DistributeBalance } from './fund/DistributeBalance';

export const CreateFund = buildCreateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TYPES.FundRepo,
});

export const UpdateFund = buildUpdateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TYPES.FundRepo,
});

// Transactions scenarios
export { AddCost } from './cost/AddCost';

export { AddIncome } from './income/AddIncome';
