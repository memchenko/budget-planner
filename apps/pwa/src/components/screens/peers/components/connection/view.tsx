import { observer } from 'mobx-react-lite';
import feather from 'feather-icons';

import { useController } from '~/shared/hooks/useController';
import { WebRTCConnection } from '~/components/features/webrtc-connection';
import { PrimaryButton } from '~/components/ui/primary-button';
import { SecondaryButton } from '~/components/ui/secondary-button';
import { ConnectionController } from './controller';

export type ConnectionProps = {
  onConnected: VoidFunction;
};

export const Connection = observer((props: ConnectionProps) => {
  const ctrl = useController(ConnectionController);

  return (
    <div>
      {ctrl.shouldStartConnecting ? (
        <WebRTCConnection
          isInitiator={ctrl.isInitiator}
          onConnected={() => {
            ctrl.connect();
            props.onConnected();
          }}
        />
      ) : (
        <div className="flex gap-2 p-2 justify-center">
          <PrimaryButton size="lg" className="flex gap-2" onPress={ctrl.initiate}>
            <span dangerouslySetInnerHTML={{ __html: feather.icons.grid.toSvg() }} />
            Initiate
          </PrimaryButton>
          <SecondaryButton size="lg" className="flex gap-2" onPress={ctrl.answer}>
            <span dangerouslySetInnerHTML={{ __html: feather.icons.camera.toSvg() }} />
            Answer
          </SecondaryButton>
        </div>
      )}
    </div>
  );
});
