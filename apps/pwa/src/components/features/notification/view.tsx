import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/hooks/useController';
import { NotificationController } from './controller';
import { Alert } from '@nextui-org/alert';

export const Notification = observer(() => {
  const ctrl = useController(NotificationController);

  if (!ctrl.isOpen) {
    return null;
  }

  return (
    <div className="fixed p-2 bottom-0 right-0 z-50">
      <Alert variant="solid" color={ctrl.type} title={ctrl.text} />
    </div>
  );
});
