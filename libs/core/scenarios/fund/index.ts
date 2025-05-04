import { buildCreateEntityScenario, buildUpdateEntityScenario } from 'core/shared/factories';
import { ENTITY_NAME } from 'core/shared/constants';
import { TOKENS } from 'core/types';
import { Fund } from 'core/entities/Fund';
import { fund } from 'core/shared/schemas';

export const CreateFund = buildCreateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FUND_REPO,
});

export const UpdateFund = buildUpdateEntityScenario<Fund>({
  entityName: ENTITY_NAME.FUND,
  repoType: TOKENS.FUND_REPO,
  sharingRuleEntityName: fund,
});

export { DeleteFund } from './DeleteFund';
