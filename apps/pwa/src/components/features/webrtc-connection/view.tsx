import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import feather from 'feather-icons';
import { useController } from '~/shared/hooks/useController';
import { WebRTCConnectionController } from './controller';
import styles from './styles.module.css';
import { PrimaryButton } from '~/components/ui/primary-button';
import { Qr } from './components/qr';
import { QrReader } from './components/qr-reader';
import { Progress } from '@nextui-org/progress';

export interface WebRTCConnectionProps {
  isInitiator: boolean;
  onConnected: VoidFunction;
}

export const WebRTCConnection = observer((props: WebRTCConnectionProps) => {
  const ctrl = useController(WebRTCConnectionController);
  ctrl.onReady = props.onConnected;

  useEffect(() => {
    if (props.isInitiator) {
      ctrl.initiateOffering();
    } else {
      ctrl.initiateAnswering();
    }

    return ctrl.reset;
  }, [props.isInitiator, ctrl]);

  return (
    <div>
      {ctrl.shouldDisplayQrCode && (
        <div className="flex flex-col gap-4 items-end">
          <Qr data={ctrl.qrCodeValue} />
          <div className={styles.proceed}>
            <PrimaryButton fullWidth onPress={ctrl.readAnswer}>
              <span dangerouslySetInnerHTML={{ __html: feather.icons.camera.toSvg() }} />
              Proceed
            </PrimaryButton>
          </div>
        </div>
      )}

      {ctrl.shouldReadCode && <QrReader onRead={ctrl.handleQRCodes}></QrReader>}

      {ctrl.shouldDisplayProgress && <Progress isIndeterminate label={ctrl.progressText} />}
    </div>
  );
});
