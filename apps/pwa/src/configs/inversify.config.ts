import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { scenariosModule } from '../../../../libs/core';
import { reposModule } from '../lib/repos';
import { entitiesModule } from '../entities';
import { ScenarioRunner } from '../modules/scenario-runner';

export const container = new Container({ defaultScope: 'Singleton' });

container.load(buildProviderModule(), entitiesModule, reposModule, scenariosModule);

container.bind(ScenarioRunner).toSelf();
