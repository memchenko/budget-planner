import { makeAutoObservable, observable } from 'mobx';
import { injectable } from 'inversify';

@injectable()
export class App {
  @observable isLoaded = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
