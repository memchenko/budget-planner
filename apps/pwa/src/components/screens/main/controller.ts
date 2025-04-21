import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, action, computed } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import { first } from 'rxjs/operators';
import { UserReadyEvent } from '~/shared/events';
import { SynchronizationOrder } from '~/stores/synchronization-order';
import { App } from '~/stores/app';
import { INavigateFunc } from '~/shared/interfaces';
import { pages } from '~/shared/constants/pages';

@provide(MainController)
export class MainController {
  constructor(
    @inject(TOKENS.EVENTS.USER_READY) private userReadyEvent: UserReadyEvent,
    @inject(TOKENS.SYNCHRONIZATION_ORDER_STORE) private readonly syncStore: SynchronizationOrder,
    @inject(TOKENS.APP_STORE) private readonly appStore: App,
    @inject(TOKENS.NAVIGATE_FUNC) private readonly navigate: INavigateFunc,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.userReadyEvent.pull().pipe(first()).subscribe(this.handleStoresReady);
  }

  @computed
  get isLoading() {
    return !this.appStore.isLoaded;
  }

  @computed
  get isSyncing() {
    return this.syncStore.isSyncing;
  }

  @action
  async handleStoresReady() {
    this.appStore.isLoaded = true;
  }

  handleAddNewFundClick = () => {
    this.navigate(pages.addFund);
  };
}
