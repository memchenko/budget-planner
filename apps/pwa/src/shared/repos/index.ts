import { ContainerModule } from 'inversify';
import toUpper from 'lodash/toUpper';
import snakeCase from 'lodash/snakeCase';
import { TOKENS } from '~/shared/constants/di';
import { buildRepo } from './buildRepos';
import { Repo, entities } from '#/libs/core';
import { COST_TAG_REPO } from './costTagRepo';
import { INCOME_TAG_REPO } from './incomeTagRepo';

export const reposModule = new ContainerModule((bind) => {
  (['cost', 'fund', 'income', 'tag', 'user', 'wallet', 'sharing-rule', 'synchronization-order'] as const).forEach(
    (entityName) => {
      const providerTokenKey = `${toUpper(snakeCase(entityName))}_REPO` as Exclude<keyof typeof TOKENS, 'EVENTS'>;
      const providerToken = TOKENS[providerTokenKey];

      bind(providerToken).to(buildRepo({ entityName })).inSingletonScope();
    },
  );

  bind<Repo<entities.CostTag>>(TOKENS.COST_TAG_REPO).to(COST_TAG_REPO).inSingletonScope();
  bind<Repo<entities.IncomeTag>>(TOKENS.INCOME_TAG_REPO).to(INCOME_TAG_REPO).inSingletonScope();
});
