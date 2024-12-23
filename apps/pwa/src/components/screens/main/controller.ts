import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, observable, action } from 'mobx';
import { TOKENS } from '~/shared/app/di';
import { Observable, Subscription } from 'rxjs';
import { UserReadyEvent } from '~/shared/events';

@provide(MainController)
export class MainController {
  @observable isLoading = true;

  private userReadySubscription: Subscription;

  constructor(@inject(TOKENS.EVENTS.USER_READY) private userReadyEvent: Observable<UserReadyEvent>) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.userReadySubscription = this.userReadyEvent.subscribe(this.handleStoresReady);
  }

  @action
  async handleStoresReady() {
    this.userReadySubscription.unsubscribe();

    this.isLoading = false;
  }
}
