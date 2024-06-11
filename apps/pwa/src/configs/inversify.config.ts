import { Container } from 'inversify';
import { TOKENS, Repo, entities } from '../../../../libs/core';
import { store } from '../app/store';
import { buildRepo, Entity } from '../lib/redux/repo';
import { getAllCosts, actions } from '../entities/cost';

export const container = new Container();

container.bind<Repo<entities.Cost & Entity>>(TOKENS.CostRepo).to(
  buildRepo<entities.Cost & Entity>({
    idPrefix: 'cost',
    repoName: 'CostRepo',
    getAll: getAllCosts,
    store,
    actions,
  }),
);
