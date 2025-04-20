import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import QRCode from 'qrcode';
import { TOKENS } from '~/shared/constants/di';
import { NotificationShowEvent } from '~/shared/events';
import { assert } from 'ts-essentials';

@provide(QRController)
export class QRController {
  data: string | null = null;
  canvas: HTMLCanvasElement | null = null;

  constructor(
    @inject(TOKENS.EVENTS.NOTIFICATION_SHOW)
    private readonly notificationShowEvent: NotificationShowEvent,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async handleClipboardClickButton() {
    try {
      assert(this.data);

      await navigator.clipboard.writeText(btoa(this.data));
    } catch {
      this.notificationShowEvent.push({
        type: 'error',
        message: 'Cannot copy data',
      });
    }
  }

  setCanvas(element: HTMLCanvasElement | null) {
    try {
      assert(element && this.data);

      this.canvas = element;

      QRCode.toCanvas(element, this.data, {});
    } catch {
      this.notificationShowEvent.push({
        type: 'error',
        message: 'Cannot initiate qr code',
      });
    }
  }
}
