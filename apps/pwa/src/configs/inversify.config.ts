import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { scenariosModule } from '#/libs/core';
import { reposModule } from '~/lib/repos';
import { entitiesModule } from '~/entities';
import { ScenarioRunner } from '~/modules/scenario-runner';
import { eventsModule } from '~/lib/events';
import { TOKENS } from '~/lib/app/di';
import { WebRTC } from '~/modules/webrtc';
import { webRtcMessageSchema } from '~/lib/schemas/webrtc';
import { CreateUser } from '~/cases/create-user';

export const container = new Container({ defaultScope: 'Singleton' });

container.load(buildProviderModule(), entitiesModule, reposModule, scenariosModule, eventsModule);

container.bind(TOKENS.ScenarioRunner).toConstantValue(new ScenarioRunner());

container.bind(TOKENS.WebRTC).toConstantValue(new WebRTC(webRtcMessageSchema));

container.resolve(CreateUser);
