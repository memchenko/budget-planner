import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { reaction } from 'mobx';
import { User } from '../../entities/user';
import { ScenarioRunner } from '../../services/scenarioRunner';
import { TOKENS } from '../../lib/app/di';

@provide(MainController)
export class MainController {
  constructor(
    @inject(TOKENS.UserStore) private usersStore: User,
    @inject(ScenarioRunner) private scenario: ScenarioRunner,
  ) {
    reaction(() => usersStore.isReady, this.onUserStoreReady.bind(this));
  }

  onUserStoreReady() {
    const users = this.usersStore.getAll();

    if (users.length === 0) {
      this.scenario.execute({
        scenario: 'CreateUser',
        payload: {},
      });
    }
  }
}
