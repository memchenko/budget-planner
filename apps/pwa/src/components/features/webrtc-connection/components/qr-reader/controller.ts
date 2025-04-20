import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { makeAutoObservable } from 'mobx';
import QrScanner from 'qr-scanner';
import { hasProperty } from '~/shared/type-guards';
import { TOKENS } from '~/shared/constants/di';
import { NotificationShowEvent } from '~/shared/events';

@provide(QRReaderController)
export class QRReaderController {
  videoEl: HTMLVideoElement | null = null;
  qrScanner: QrScanner | null = null;
  onRead?: (data: string) => void;

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

  setVideoElement(video: HTMLVideoElement | null) {
    if (!video) {
      this.notificationShowEvent.push({
        type: 'error',
        message: "Camera couldn't initiate",
      });
      return;
    }

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

    this.qrScanner.start();
  }

  reset() {
    this.qrScanner?.stop();
    this.qrScanner?.destroy();
  }
}
