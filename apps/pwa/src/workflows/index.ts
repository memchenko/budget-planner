import { Container } from 'inversify';
import { Greeting } from './greeting';
import { CreateUser } from './create-user';
import { Synchronizer } from './synchronize';
import { Connection, Prompt, Notification, EventBus } from './impl';
import { WORKFLOW_TOKENS, IConnection, IPrompt, INotification, IEventBus } from './types';

export const initiateWorkflows = (container: Container) => {
  container.bind<IConnection>(WORKFLOW_TOKENS.IConnection).to(Connection).inRequestScope();
  container.bind<IPrompt>(WORKFLOW_TOKENS.IPrompt).to(Prompt);
  container.bind<INotification>(WORKFLOW_TOKENS.INotification).to(Notification);
  container.bind<IEventBus>(WORKFLOW_TOKENS.IEventBus).to(EventBus);

  container.resolve(CreateUser);
  container.resolve(Greeting);
  container.resolve(Synchronizer);
};
