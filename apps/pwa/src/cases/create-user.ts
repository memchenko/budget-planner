import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { when, IReactionDisposer } from 'mobx';
import { User } from '~/entities/user';
import { EventBus } from '~/shared/impl/event-bus';
import { ScenarioRunner } from '~/shared/impl/scenario-runner';
import { TOKENS } from '~/shared/constants/di';
import { faker } from '@faker-js/faker';

@provide(CreateUser)
export class CreateUser {
  private userStoreReadyDisposer: IReactionDisposer;

  constructor(
    @inject(TOKENS.USER_STORE)
    private readonly usersStore: User,
    @inject(TOKENS.EVENT_BUS)
    private readonly eventBus: EventBus,
    @inject(TOKENS.SCENARIO_RUNNER)
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
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          avatarSrc: faker.image.avatar(),
        },
      });
    }

    this.eventBus.publish(TOKENS.EVENTS.USER_READY, {});
  }
}
