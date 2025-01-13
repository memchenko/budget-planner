import { ContainerModule } from 'inversify';

import { TOKENS } from '~/shared/constants/di';
import { UserReadyEvent, ModalShowEvent, ModalCloseEvent, NotificationShowEvent } from './events';

export * from './events';

export const eventsModule = new ContainerModule((bind) => {
  bind(TOKENS.EVENTS.USER_READY).toConstantValue(new UserReadyEvent());
  bind(TOKENS.EVENTS.MODAL_SHOW).toConstantValue(new ModalShowEvent());
  bind(TOKENS.EVENTS.MODAL_CLOSE).toConstantValue(new ModalCloseEvent());
  bind(TOKENS.EVENTS.NOTIFICATION_SHOW).toConstantValue(new NotificationShowEvent());
});
