import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { assert } from 'ts-essentials';
import { TOKENS } from '~/shared/constants/di';
import * as user from '~/stores/user';
import { userSchema } from '#/libs/core/entities/User';
import { user as userEntityName } from '#/libs/core/shared/schemas';
import { matchesSchema } from '~/shared/type-guards';
import {
  WORKFLOW_TOKENS,
  PEER_EVENTS,
  INotification,
  ICooperativeWorkflow,
  IPrompt,
  IConnection,
  IEventBus,
  LOCAL_EVENTS,
} from './types';
import { entityAcceptedSchema } from './schemas';

@provide(Greeting)
export class Greeting implements ICooperativeWorkflow {
  private isInitiator = false;

  constructor(
    @inject(WORKFLOW_TOKENS.IPrompt) private readonly prompt: IPrompt,
    @inject(WORKFLOW_TOKENS.INotification) private readonly notification: INotification,
    @inject(WORKFLOW_TOKENS.IConnection) private readonly peer: IConnection,
    @inject(WORKFLOW_TOKENS.IEventBus) private readonly eventBus: IEventBus,
    @inject(TOKENS.USER_STORE) private readonly user: user.User,
  ) {
    this.peer.listen(PEER_EVENTS.GREET, this.answer.bind(this));
    this.eventBus.listen(LOCAL_EVENTS.START_GREETING, this.execute.bind(this));
  }

  async execute() {
    this.isInitiator = true;

    this.peer.startChannel();
    this.peer.send(PEER_EVENTS.GREET, this.user.current);

    const isAccepted = await this.isUserAccepted();

    if (!isAccepted) {
      this.notification.error("Answerer didn't accepted invitation");
      return this.peer.close();
    }

    const answerer = await this.peer.receive(PEER_EVENTS.GREET);
    assert(matchesSchema(answerer, userSchema), 'Invalid answerer user data');

    if (await this.user.hasOneById(answerer.id)) {
      this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(answerer.id, true));
      this.notification.success('Connected');
      this.peer.endChannel();
      this.eventBus.send(LOCAL_EVENTS.GREETED_PEER, answerer.id);
      this.user.connectUser(answerer.id);

      const unsub = this.peer.onclose(() => {
        this.notification.info(`${answerer.firstName} ${answerer.lastName} disconnected`);
        this.user.disconnectUser(answerer.id);
        unsub();
      });
      return;
    }

    const shouldAcceptAnswererData = Boolean(
      await this.prompt.question(
        'Do you accept user?',
        `User ${answerer.firstName} ${answerer.lastName} wants to subscribe to you.`,
      ),
    );

    if (!shouldAcceptAnswererData) {
      this.notification.error('You refused to connect to the peer.');
      this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(answerer.id, false));
      return this.peer.close();
    }

    await this.user.add(answerer as unknown as user.EntityType);

    this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(answerer.id, true));
    this.notification.success('Connected');
    this.peer.endChannel();
    this.eventBus.send(LOCAL_EVENTS.GREETED_PEER, answerer.id);
    this.user.connectUser(answerer.id);

    const unsub = this.peer.onclose(() => {
      this.notification.info(`${answerer.firstName} ${answerer.lastName} disconnected`);
      this.user.disconnectUser(answerer.id);
      unsub();
    });
  }

  async answer(initiator: unknown): Promise<void> {
    if (this.isInitiator) {
      return;
    }

    assert(matchesSchema(initiator, userSchema), 'Invalid initiator user data');

    let shouldAcceptInitiatorData: boolean = true;

    if (!(await this.user.hasOneById(initiator.id))) {
      shouldAcceptInitiatorData = Boolean(
        await this.prompt.question(
          'Do you accept user?',
          `User ${initiator.firstName} ${initiator.lastName} wants to subscribe to you.`,
        ),
      );

      if (shouldAcceptInitiatorData) {
        await this.user.add(initiator as unknown as user.EntityType);
      }
    }

    if (!shouldAcceptInitiatorData) {
      this.notification.error('You refused to connect to the peer.');
      this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(initiator.id, false));
      return this.peer.close();
    }

    this.peer.send(PEER_EVENTS.ENTITY_ACCEPTED, this.buildAcceptAnswer(initiator.id, true));
    this.peer.send(PEER_EVENTS.GREET, this.user.current);

    const isAccepted = await this.isUserAccepted();

    if (!isAccepted) {
      this.notification.error("Initiator didn't accepted invitation");
      return this.peer.close();
    }

    this.notification.success('Connected');
    this.peer.endChannel();

    this.eventBus.send(LOCAL_EVENTS.GREETED_PEER, initiator.id);
    this.user.connectUser(initiator.id);

    const unsub = this.peer.onclose(() => {
      this.notification.info(`${initiator.firstName} ${initiator.lastName} disconnected`);
      this.user.disconnectUser(initiator.id);
      unsub();
    });
  }

  private async isUserAccepted() {
    while (true) {
      const response = await this.peer.receive(PEER_EVENTS.ENTITY_ACCEPTED, entityAcceptedSchema);

      if (response.entityType === userEntityName && response.entityId === this.user.current.id) {
        return response.answer;
      }
    }
  }

  private buildAcceptAnswer(entityId: user.EntityType['id'], answer: boolean) {
    return {
      entityType: userEntityName,
      entityId,
      answer,
    };
  }
}
