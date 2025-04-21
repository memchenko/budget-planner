import feather from 'feather-icons';
import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/hooks/useController';
import { Button } from '~/components/ui/button';
import styles from './styles.module.css';
import { QRController } from './controller';

export interface QrProps {
  data: string;
}

export const Qr = observer((props: QrProps) => {
  const ctrl = useController(QRController);
  ctrl.data = props.data;

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <canvas ref={(el) => ctrl.setCanvas(el)} className={styles.canvas} />
      <Button fullWidth size="lg" onPress={ctrl.handleClipboardClickButton}>
        <span dangerouslySetInnerHTML={{ __html: feather.icons.clipboard.toSvg() }} />
        Copy the code
      </Button>
    </div>
  );
});
