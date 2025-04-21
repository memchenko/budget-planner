import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { injectable } from 'inversify';
import * as userStore from '~/stores/user';

@injectable()
export class App {
  isLoaded = false;
  userId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, {
      name: this.constructor.name,
      properties: ['userId'],
    });
  }

  setCurrentUser(userId: userStore.EntityType['id']) {
    if (this.userId !== null) {
      return;
    }

    this.userId = userId;
  }
}
