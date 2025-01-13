import { tap } from 'rxjs/operators';
import { provide } from 'inversify-binding-decorators';
import { TOKENS } from '~/shared/constants/di';
import { ModalShowEvent, ModalCloseEvent } from '~/shared/events';
import { inject } from 'inversify';
import { action, observable, makeAutoObservable } from 'mobx';

@provide(ModalController)
export class ModalController {
  @observable isOpen = false;
  @observable heading = '';
  @observable body = '';

  private channelId: string | null = null;

  constructor(
    @inject(TOKENS.EVENTS.MODAL_SHOW) private readonly modalShow: ModalShowEvent,
    @inject(TOKENS.EVENTS.MODAL_CLOSE) private readonly modalClose: ModalCloseEvent,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.modalShow
      .pull()
      .pipe(
        tap(({ channelId, payload }) => {
          this.channelId = channelId;
          this.showPrompt(payload.question, payload.description ?? '');
        }),
      )
      .subscribe();
  }

  @action
  async showPrompt(question: string, description: string) {
    this.heading = question;
    this.body = description;
    this.isOpen = true;
  }

  closeModal(answer: boolean) {
    this.modalClose.push({ answer: JSON.stringify(answer) }, this.channelId);
    this.isOpen = false;
    this.heading = '';
    this.body = '';
  }
}
