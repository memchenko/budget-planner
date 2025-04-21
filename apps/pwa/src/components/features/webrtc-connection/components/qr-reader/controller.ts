import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import QrScanner from 'qr-scanner';
import { hasProperty } from '~/shared/type-guards';
import { TOKENS } from '~/shared/constants/di';
import { NotificationShowEvent } from '~/shared/events';

@provide(QRReaderController)
export class QRReaderController {
  onRead?: (data: string) => void;

  private qrScanner: QrScanner | null = null;
  private starting: Promise<any> | null = null;
  private resetAbortController = new AbortController();

  constructor(
    @inject(TOKENS.EVENTS.NOTIFICATION_SHOW)
    private readonly notificationShowEvent: NotificationShowEvent,
  ) {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      },
    );
  }

  async handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const image = await event.target.files?.[0];

      if (!(image instanceof File)) {
        throw new Error();
      }

      const result = await QrScanner.scanImage(image, {});

      if (hasProperty(result, 'data')) {
        this.onRead?.(result.data);
      }
    } catch {
      this.notificationShowEvent.push({
        type: 'error',
        message: 'QR code undetected',
      });
    }
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const decodedString = atob(event.target.value);

      this.onRead?.(decodedString);
    } catch {
      this.notificationShowEvent.push({
        type: 'error',
        message: 'Broken code',
      });
    }
  }

  async setVideoElement(video: HTMLVideoElement | null) {
    if (!video) {
      return this.reset();
    }

    this.resetAbortController.abort();

    try {
      this.qrScanner = new QrScanner(
        video,
        (result) => {
          if (hasProperty(result, 'data')) {
            this.onRead?.(result.data);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );

      this.starting = this.qrScanner.start();
    } catch {
      this.notificationShowEvent.push({
        type: 'error',
        message: "Camera couldn't initiate",
      });
    }
  }

  async reset() {
    try {
      await Promise.race([
        this.starting,
        new Promise((_, reject) => {
          this.resetAbortController.signal.addEventListener('abort', reject, { once: true });
        }),
      ]);
      console.log('RESETTING');

      if (this.qrScanner) {
        this.qrScanner.stop();
        this.qrScanner.destroy();

        this.qrScanner = null;
      }
    } catch {
      console.log('ABORTED');
    }
  }
}
