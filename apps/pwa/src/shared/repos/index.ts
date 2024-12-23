import { ContainerModule } from 'inversify';
import capitalize from 'lodash/capitalize';
import { TOKENS } from '~/shared/constants/di';
import { buildRepo } from './buildRepos';
import { Repo, entities } from '#/libs/core';
import { COST_TAG_REPO } from './costTagRepo';
import { INCOME_TAG_REPO } from './incomeTagRepo';

export const reposModule = new ContainerModule((bind) => {
  (['cost', 'fund', 'income', 'tag', 'user', 'wallet'] as const).forEach((entityName) => {
    const providerTokenKey = `${capitalize(entityName)}Repo` as keyof typeof TOKENS;
    const providerToken = TOKENS[providerTokenKey];

    bind(providerToken).to(buildRepo({ entityName })).inSingletonScope();
  });

  bind<Repo<entities.CostTag>>(TOKENS.COST_TAG_REPO).to(COST_TAG_REPO).inSingletonScope();
  bind<Repo<entities.IncomeTag>>(TOKENS.INCOME_TAG_REPO).to(INCOME_TAG_REPO).inSingletonScope();
});
