import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/hooks/useController';
import { WebRTCConnectionController } from './controller';
import styles from './styles.module.css';
import { PrimaryButton } from '~/shared/ui/primary-button';
import { Button } from '~/shared/ui/button';
import { Qr } from './components/qr';
import { QrReader } from './components/qr-reader';
import { Progress } from '@nextui-org/progress';

export interface WebRTCConnectionProps {
  onConnected: VoidFunction;
}

export const WebRTCConnection = observer((props: WebRTCConnectionProps) => {
  const ctrl = useController(WebRTCConnectionController);
  ctrl.onReady = props.onConnected;

  return (
    <div>
      {ctrl.shouldDisplayButtons && (
        <div className={styles.actions}>
          <PrimaryButton onClick={ctrl.initiateOffering}>Show QR Code</PrimaryButton>
          <Button onClick={ctrl.initiateAnswering}>Read QR Code</Button>
        </div>
      )}

      {ctrl.shouldDisplayQrCode && (
        <div>
          <Qr data={ctrl.qrCodeValue} />
          <div className={styles.proceed}>
            <PrimaryButton onClick={ctrl.readAnswer}>Read QR Code</PrimaryButton>
          </div>
        </div>
      )}

      {ctrl.shouldReadCode && <QrReader onRead={ctrl.handleQRCodes}></QrReader>}

      {ctrl.shouldDisplayProgress && <Progress isIndeterminate label={ctrl.progressText} />}
    </div>
  );
});
