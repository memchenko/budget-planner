import { ContainerModule } from 'inversify';

import { CostFromCollaborator, IncomeFromCollaborator, TagFromCollaborator } from './types';
import { EVENTS } from './constants';
import { TOKENS } from '~/shared/app/di';
import { EventBus } from '~/shared/impl/event-bus';

export const eventsModule = new ContainerModule((bind) => {
  const eventBus = new EventBus();

  bind(TOKENS.EventBus).toConstantValue(eventBus);

  bind(TOKENS.CostFromCollaborator).toConstantValue(
    eventBus.register<CostFromCollaborator>(EVENTS.COST_FROM_COLLABORATOR),
  );
  bind(TOKENS.IncomeFromCollaborator).toConstantValue(
    eventBus.register<IncomeFromCollaborator>(EVENTS.INCOME_FROM_COLLABORATOR),
  );
  bind(TOKENS.TagFromCollaborator).toConstantValue(
    eventBus.register<TagFromCollaborator>(EVENTS.TAG_FROM_COLLABORATOR),
  );
  bind(TOKENS.UserReady).toConstantValue(eventBus.register<null>(EVENTS.USER_READY));
});

export { EVENTS };
export * from './types';
