import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable } from 'mobx';

@provide(TabPaneController)
export class TabPaneController {
  isMakingRecord = false;

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      },
    );
  }

  startMakingRecord() {
    this.isMakingRecord = true;
  }

  stopMakingRecord() {
    this.isMakingRecord = false;
  }
}
