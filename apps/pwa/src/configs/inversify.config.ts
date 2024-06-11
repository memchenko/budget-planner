import { Container } from 'inversify';
import { TOKENS, Repo } from '../../../../libs/core';
import { store } from '../app/store';
import { buildRepo } from '../lib/redux/repo';
import * as costs from '../entities/cost';
import * as funds from '../entities/fund';
import * as incomes from '../entities/income';
import * as tags from '../entities/tag';
import * as users from '../entities/user';

export const container = new Container();

container.bind<Repo<costs.EntityType>>(TOKENS.CostRepo).to(
  buildRepo<costs.EntityType>({
    store,
    getAll: costs.getAll,
    actions: costs.actions,
  }),
);

container.bind<Repo<funds.EntityType>>(TOKENS.FundRepo).to(
  buildRepo<funds.EntityType>({
    store,
    getAll: funds.getAll,
    actions: funds.actions,
  }),
);

container.bind<Repo<incomes.EntityType>>(TOKENS.IncomeRepo).to(
  buildRepo<incomes.EntityType>({
    store,
    getAll: incomes.getAll,
    actions: incomes.actions,
  }),
);

container.bind<Repo<tags.EntityType>>(TOKENS.TagRepo).to(
  buildRepo<tags.EntityType>({
    store,
    getAll: tags.getAll,
    actions: tags.actions,
  }),
);

container.bind<Repo<users.EntityType>>(TOKENS.UserRepo).to(
  buildRepo<users.EntityType>({
    store,
    getAll: users.getAll,
    actions: users.actions,
  }),
);
