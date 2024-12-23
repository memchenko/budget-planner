import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, observable, action } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserReadyEvent } from '~/shared/events';

@provide(MainController)
export class MainController {
  @observable isLoading = true;

  constructor(@inject(TOKENS.EVENTS.USER_READY) private userReadyEvent: Observable<UserReadyEvent>) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.userReadyEvent.pipe(first()).subscribe(this.handleStoresReady);
  }

  @action
  async handleStoresReady() {
    this.isLoading = false;
  }
}
