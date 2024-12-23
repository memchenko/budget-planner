import { ContainerModule } from 'inversify';
import capitalize from 'lodash/capitalize';
import { TOKENS } from '~/shared/constants/di';
import { buildRepo } from './buildRepos';
import { Repo, entities } from '#/libs/core';
import { CostTagRepo } from './costTagRepo';
import { IncomeTagRepo } from './incomeTagRepo';

export const reposModule = new ContainerModule((bind) => {
  (['cost', 'fund', 'income', 'tag', 'user', 'wallet'] as const).forEach((entityName) => {
    const providerTokenKey = `${capitalize(entityName)}Repo` as keyof typeof TOKENS;
    const providerToken = TOKENS[providerTokenKey];

    bind(providerToken).to(buildRepo({ entityName })).inSingletonScope();
  });

  bind<Repo<entities.CostTag>>(TOKENS.CostTagRepo).to(CostTagRepo).inSingletonScope();
  bind<Repo<entities.IncomeTag>>(TOKENS.IncomeTagRepo).to(IncomeTagRepo).inSingletonScope();
});
