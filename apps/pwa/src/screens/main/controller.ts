import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TOKENS } from '../../lib/misc/di';
import { getAll } from '../../entities/user';
import { execute } from '../../services/scenarioRunner';

@provide(MainController)
export class MainController {
  constructor(@inject(TOKENS.Store) private store: Store) {
    const users = getAll(this.store);

    if (users.length === 0) {
      this.store.dispatch(
        execute({
          scenario: 'CreateUser',
          payload: {},
        }),
      );
    }
  }
}
