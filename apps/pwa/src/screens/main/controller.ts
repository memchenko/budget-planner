import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { reaction, computed } from 'mobx';
import { User } from '../../entities/user';
import { Fund } from '../../entities/fund';
import { ScenarioRunner } from '../../services/scenarioRunner';
import { TOKENS } from '../../lib/app/di';

@provide(MainController)
export class MainController {
  constructor(
    @inject(TOKENS.UserStore) private usersStore: User,
    @inject(ScenarioRunner) private scenario: ScenarioRunner,
    @inject(TOKENS.FundStore) private fundsStore: Fund,
  ) {
    reaction(() => usersStore.isReady, this.onUserStoreReady.bind(this));
  }

  @computed
  get shouldDisplayFunds() {
    return this.fundsStore.isReady && this.fundsStore.hasFunds;
  }

  onUserStoreReady() {
    const users = this.usersStore.all;

    if (users.length === 0) {
      this.scenario.execute({
        scenario: 'CreateUser',
        payload: {},
      });
    }
  }
}
