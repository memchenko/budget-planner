import { PropsWithChildren, useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';
import styles from './styles.module.css';
import { hasProperty } from '~/shared/type-guards.js';

export interface QrReaderProps extends PropsWithChildren<unknown> {
  onRead: (data: string) => void;
}

export const QrReader = (props: QrReaderProps) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const qrScanner = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (video !== null && qrScanner.current === null) {
      qrScanner.current = new QrScanner(
        video,
        (result) => {
          if (hasProperty(result, 'data')) {
            props.onRead(result.data);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );

      qrScanner.current.start();

      return () => {
        qrScanner.current?.stop();
        qrScanner.current?.destroy();
      };
    }
  }, [video, qrScanner, props]);

  return <video ref={(elem) => setVideo(elem)} className={styles.qrReader}></video>;
};
