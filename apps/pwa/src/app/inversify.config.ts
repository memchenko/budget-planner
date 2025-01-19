import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { scenariosModule } from '#/libs/core';
import { reposModule } from '~/shared/repos';
import { entitiesModule } from '~/stores';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { eventsModule } from '~/shared/events';
import { TOKENS } from '~/shared/constants/di';
import { WebRTC } from '~/shared/impl/webrtc';
import { initiateWorkflows } from '~/workflows';
import { INavigateFunc } from '~/shared/interfaces';

export let container!: Container;

export type SetupArgs = {
  navigate: INavigateFunc;
};

export const setup = ({ navigate }: SetupArgs) => {
  if (container) {
    return container;
  }

  container = new Container({ defaultScope: 'Singleton' });

  container.load(buildProviderModule(), entitiesModule, reposModule, scenariosModule, eventsModule);

  container.bind(TOKENS.SCENARIO_RUNNER).toConstantValue(new ScenarioRunner());

  container.bind(TOKENS.WEB_RTC).toConstantValue(new WebRTC());

  container.bind(TOKENS.NAVIGATE_FUNC).toConstantValue(navigate);

  initiateWorkflows(container);

  return container;
};
