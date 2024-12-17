import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { scenariosModule } from '#/libs/core';
import { reposModule } from '~/shared/repos';
import { entitiesModule } from '~/entities';
import { ScenarioRunner } from '~/modules/scenario-runner';
import { eventsModule } from '~/shared/events';
import { TOKENS } from '~/shared/app/di';
import { WebRTC } from '~/modules/webrtc';
import { webRtcMessageSchema } from '~/shared/schemas/webrtc';
import { CreateUser } from '~/cases/create-user';

export const container = new Container({ defaultScope: 'Singleton' });

container.load(buildProviderModule(), entitiesModule, reposModule, scenariosModule, eventsModule);

container.bind(TOKENS.ScenarioRunner).toConstantValue(new ScenarioRunner());

container.bind(TOKENS.WebRTC).toConstantValue(new WebRTC(webRtcMessageSchema));

container.resolve(CreateUser);
