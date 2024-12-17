import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { when, IReactionDisposer } from 'mobx';
import { TOKENS } from '~/lib/app/di';
import { User } from '~/entities/user';
import { EventBus } from '~/modules/event-bus';
import { ScenarioRunner } from '~/modules/scenario-runner';
import { EVENTS } from '~/lib/events';

@provide(CreateUser)
export class CreateUser {
  private userStoreReadyDisposer: IReactionDisposer;

  constructor(
    @inject(TOKENS.UserStore)
    private readonly usersStore: User,
    @inject(TOKENS.EventBus)
    private readonly eventBus: EventBus,
    @inject(TOKENS.ScenarioRunner)
    private readonly scenarioRunner: ScenarioRunner,
  ) {
    this.userStoreReadyDisposer = when(() => this.usersStore.isReady, this.handleUserStoreReady.bind(this));
  }

  async handleUserStoreReady() {
    this.userStoreReadyDisposer();

    if (this.usersStore.isReady && this.usersStore.all.length === 0) {
      await this.scenarioRunner.execute({
        scenario: 'CreateUser',
        payload: {
          firstName: '',
          lastName: '',
          avatarSrc: '',
        },
      });
    }

    this.eventBus.publish(EVENTS.USER_READY, null);
  }
}
