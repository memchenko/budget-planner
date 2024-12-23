import { ContainerModule } from 'inversify';

import { TOKENS } from '~/shared/constants/di';
import { EventBus, Event } from '~/shared/impl/event-bus';

export type UserReadyEvent = Event<'user-ready', object>;

export const eventsModule = new ContainerModule((bind) => {
  const eventBus = new EventBus();

  bind(TOKENS.EVENT_BUS).toConstantValue(eventBus);

  bind(TOKENS.EVENTS.USER_READY).toConstantValue(eventBus.register<UserReadyEvent>(TOKENS.EVENTS.USER_READY));
});
