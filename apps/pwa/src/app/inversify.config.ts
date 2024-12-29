import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { scenariosModule } from '#/libs/core';
import { reposModule } from '~/shared/repos';
import { entitiesModule } from '~/entities';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { eventsModule } from '~/shared/events';
import { TOKENS } from '~/shared/constants/di';
import { WebRTC } from '~/shared/impl/webrtc';
import { Synchronizer } from '~/shared/impl/syncronizer';
import { webRtcMessageSchema } from '~/shared/schemas/webrtc';
import { CreateUser } from '~/cases/create-user';

export let container!: Container;

export const setup = () => {
  if (container) {
    return;
  }

  container = new Container({ defaultScope: 'Singleton' });

  container.load(buildProviderModule(), entitiesModule, reposModule, scenariosModule, eventsModule);

  container.bind(TOKENS.SCENARIO_RUNNER).toConstantValue(new ScenarioRunner());

  container.bind(TOKENS.WEB_RTC).toConstantValue(new WebRTC(webRtcMessageSchema));

  container.bind(TOKENS.SYNCHRONIZER).to(Synchronizer);

  container.resolve(CreateUser);
};
