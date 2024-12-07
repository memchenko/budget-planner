import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import styles from './styles.module.css';

export interface QrProps {
  data: string;
}

export const Qr = (props: QrProps) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas !== null) {
      QRCode.toCanvas(canvas, props.data, {});
    }
  }, [props, canvas]);

  return (
    <div className={styles.qr}>
      <canvas ref={(el) => setCanvas(el)} className={styles.canvas}></canvas>
    </div>
  );
};
