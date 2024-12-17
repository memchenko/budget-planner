import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, observable, action } from 'mobx';
import { TOKENS } from '~/lib/app/di';
import { Subject, Subscription } from 'rxjs';

@provide(MainController)
export class MainController {
  @observable isLoading = true;

  private userReadySubscription: Subscription;

  constructor(@inject(TOKENS.UserReady) private userReadyEvent: Subject<null>) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.userReadySubscription = this.userReadyEvent.subscribe(this.handleStoresReady);
  }

  @action
  async handleStoresReady() {
    this.userReadySubscription.unsubscribe();

    this.isLoading = false;
  }
}
