import { observer } from 'mobx-react-lite';
import { Screen } from '~/components/layouts/screen';
import { WebRTCConnection } from '~/components/features/webrtc-connection';
import { useController } from '~/shared/hooks/useController';
import { ConnectionController } from './controller';

export const Connection = observer(() => {
  const ctrl = useController(ConnectionController);

  return (
    <Screen>
      <WebRTCConnection onConnected={ctrl.handleWebRTCConnected} />
    </Screen>
  );
});
