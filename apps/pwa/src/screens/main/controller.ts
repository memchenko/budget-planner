import { inject, injectable } from 'inversify';
import { TOKENS } from '../../lib/misc/di';
import { getAll } from '../../entities/user';
import { execute } from '../../services/scenarioRunner';
import { BaseController, IController } from '../../lib/controller';
import { container } from '../../configs/inversify.config';

@injectable()
export class MainController extends BaseController implements IController {
  @inject(TOKENS.Store)
  store!: Store;

  initialize() {
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

container.bind<MainController>(MainController).toSelf().inTransientScope();
