import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { User } from '../../entities/user';
import { ScenarioRunner } from '../../services/scenarioRunner';
import { TOKENS } from '../../lib/misc/di';

@provide(MainController)
export class MainController {
  constructor(@inject(TOKENS.UserStore) usersStore: User, @inject(ScenarioRunner) scenario: ScenarioRunner) {
    const users = usersStore.getAll();

    if (users.length === 0) {
      scenario.execute({
        scenario: 'CreateUser',
        payload: {},
      });
    }
  }
}
