import { Store } from '@reduxjs/toolkit';
import { Container } from 'inversify';
import { Repo, entities } from '../../../../libs/core';
import { store } from '../app/store';
import { buildRepo } from '../lib/redux/repo';
import { TOKENS } from '../lib/misc/di';
import * as costs from '../entities/cost';
import * as funds from '../entities/fund';
import * as incomes from '../entities/income';
import * as tags from '../entities/tag';
import * as users from '../entities/user';
import * as dictionaries from '../entities/dictionaries';

export const container = new Container();

container.bind<Store>(TOKENS.Store).toConstantValue(store);

container.bind<Repo<costs.EntityType>>(TOKENS.CostRepo).to(
  buildRepo<costs.EntityType>({
    getAll: costs.getAll,
    actions: costs.actions,
  }),
);

container.bind<Repo<funds.EntityType>>(TOKENS.FundRepo).to(
  buildRepo<funds.EntityType>({
    getAll: funds.getAll,
    actions: funds.actions,
  }),
);

container.bind<Repo<incomes.EntityType>>(TOKENS.IncomeRepo).to(
  buildRepo<incomes.EntityType>({
    getAll: incomes.getAll,
    actions: incomes.actions,
  }),
);

container.bind<Repo<tags.EntityType>>(TOKENS.TagRepo).to(
  buildRepo<tags.EntityType>({
    getAll: tags.getAll,
    actions: tags.actions,
  }),
);

container.bind<Repo<users.EntityType>>(TOKENS.UserRepo).to(
  buildRepo<users.EntityType>({
    getAll: users.getAll,
    actions: users.actions,
  }),
);

container.bind<Repo<entities.CostTag>>(TOKENS.CostTagRepo).to(dictionaries.CostTagRepo);

container.bind<Repo<entities.IncomeTag>>(TOKENS.IncomeTagRepo).to(dictionaries.IncomeTagRepo);
