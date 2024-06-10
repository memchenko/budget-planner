import { buildCreateEntityScenario, buildDeleteEntityScenario } from '../shared/factories';
import { ENTITY_NAME } from '../shared/constants';
import { TYPES } from '../types';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';

export const DeleteUser = buildDeleteEntityScenario<User>({
  entityName: ENTITY_NAME.USER,
  repoType: TYPES.UserRepo,
});

export const CreateTag = buildCreateEntityScenario<Tag>({
  entityName: ENTITY_NAME.TAG,
  repoType: TYPES.TagRepo,
});

export { CreateUser } from './user/CreateUser';
export { AddCost } from './cost/AddCost';
