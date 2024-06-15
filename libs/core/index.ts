import { ContainerModule } from 'inversify';
import * as scenarios from './scenarios';

export * as entities from './entities';
export * as scenarios from './scenarios';
export * from './types';
export * from './shared/types';
export * from './errors/ScenarioError';

export const scenariosModule = new ContainerModule((bind) => {
  Object.values(scenarios).forEach((scenario: Parameters<typeof bind>[0]) => {
    bind(scenario).toSelf().inTransientScope();
  });
});
