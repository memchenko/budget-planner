import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { injectable } from 'inversify';

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
}
