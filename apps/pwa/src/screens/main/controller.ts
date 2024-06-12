import type { Store } from '@reduxjs/toolkit';
import { inject } from 'inversify';
import { TOKENS } from '../../lib/misc/di';
import { getAll } from '../../entities/user';
import { execute } from '../../services/scenarioRunner';
import { BaseController } from '../../lib/controller';

export class MainController extends BaseController {
  @inject(TOKENS.Store)
  private store!: Store;

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
