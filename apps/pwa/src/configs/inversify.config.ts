import { Container } from 'inversify';
import { Repo, entities, scenarios } from '../../../../libs/core';
import { buildRepo } from '../lib/redux/repo';
import { TOKENS } from '../lib/misc/di';
import * as costs from '../entities/cost';
import * as funds from '../entities/fund';
import * as incomes from '../entities/income';
import * as tags from '../entities/tag';
import * as users from '../entities/user';
import * as dictionaries from '../entities/dictionaries';

export const container = new Container({ defaultScope: 'Singleton' });

container.bind<Repo<costs.EntityType>>(TOKENS.CostRepo).to(
  buildRepo<costs.EntityType>({
    getAll: costs.getAll,
    actions: costs.slice.actions,
  }),
);

container.bind<Repo<funds.EntityType>>(TOKENS.FundRepo).to(
  buildRepo<funds.EntityType>({
    getAll: funds.getAll,
    actions: funds.slice.actions,
  }),
);

container.bind<Repo<incomes.EntityType>>(TOKENS.IncomeRepo).to(
  buildRepo<incomes.EntityType>({
    getAll: incomes.getAll,
    actions: incomes.slice.actions,
  }),
);

container.bind<Repo<tags.EntityType>>(TOKENS.TagRepo).to(
  buildRepo<tags.EntityType>({
    getAll: tags.getAll,
    actions: tags.slice.actions,
  }),
);

container.bind<Repo<users.EntityType>>(TOKENS.UserRepo).to(
  buildRepo<users.EntityType>({
    getAll: users.getAll,
    actions: users.slice.actions,
  }),
);

container.bind<Repo<entities.CostTag>>(TOKENS.CostTagRepo).to(dictionaries.CostTagRepo);

container.bind<Repo<entities.IncomeTag>>(TOKENS.IncomeTagRepo).to(dictionaries.IncomeTagRepo);

Object.values(scenarios).forEach((scenario: Parameters<Container['bind']>[0]) => {
  container.bind(scenario).toSelf().inTransientScope();
});
