import { observer } from 'mobx-react-lite';
import { WebRTCConnection } from '~/components/features/webrtc-connection';
import { useController } from '~/shared/hooks/useController';
import { ConnectionController } from './controller.js';

export const Connection = observer(() => {
  const ctrl = useController(ConnectionController);

  return (
    <div>
      <WebRTCConnection onConnected={ctrl.handleWebRTCConnected} />
    </div>
  );
});
