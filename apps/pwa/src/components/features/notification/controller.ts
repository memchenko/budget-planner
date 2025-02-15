import { tap } from 'rxjs/operators';
import { provide } from 'inversify-binding-decorators';
import { TOKENS } from '~/shared/constants/di';
import { NotificationShowEvent } from '~/shared/events';
import { inject } from 'inversify';
import { timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { observable, makeAutoObservable, action } from 'mobx';

@provide(NotificationController)
export class NotificationController {
  @observable text: string = '';
  @observable type: 'default' | 'danger' | 'success' | 'warning' = 'default';
  @observable isOpen = false;

  constructor(@inject(TOKENS.EVENTS.NOTIFICATION_SHOW) private readonly notificationShow: NotificationShowEvent) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.notificationShow
      .pull()
      .pipe(
        tap(({ payload }) => {
          switch (payload.type) {
            case 'info':
              return this.showInfo(payload.message);
            case 'warning':
              return this.showWarning(payload.message);
            case 'error':
              return this.showError(payload.message);
            case 'success':
              return this.showSuccess(payload.message);
          }
        }),
        concatMap(() => {
          return timer(4000).pipe(tap(this.close));
        }),
      )
      .subscribe();
  }

  @action
  showInfo(message: string) {
    this.text = message;
    this.type = 'default';
    this.isOpen = true;
  }

  @action
  showError(message: string) {
    this.text = message;
    this.type = 'danger';
    this.isOpen = true;
  }

  @action
  showWarning(message: string) {
    this.text = message;
    this.type = 'warning';
    this.isOpen = true;
  }

  @action
  showSuccess(message: string) {
    this.text = message;
    this.type = 'success';
    this.isOpen = true;
  }

  @action
  close() {
    this.isOpen = false;
    this.text = '';
    this.type = 'default';
  }
}
