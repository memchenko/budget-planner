import { observer } from 'mobx-react-lite';
import { Progress } from '@nextui-org/progress';
import { Navigate } from 'react-router-dom';
import { Screen } from '~/components/layouts/screen';
import { WebRTCConnection } from '~/components/features/webrtc-connection';
import { useController } from '~/shared/hooks/useController';
import { P2PSynchronizationController } from './controller';

export const P2PSynchronization = observer(() => {
  const ctrl = useController(P2PSynchronizationController);

  return (
    <Screen>
      {!ctrl.shouldDisplayProgress && <WebRTCConnection onConnected={ctrl.handleWebRTCConnected} />}
      {ctrl.shouldDisplayProgress && <Progress isIndeterminate label="Synchronizing" />}
      {ctrl.isSynchronized && <Navigate to="../" relative="route" />}
    </Screen>
  );
});
