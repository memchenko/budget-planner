import { observer } from 'mobx-react-lite';
import { User } from '@nextui-org/user';
import { useDisclosure } from '@nextui-org/react';
import { Card, CardBody } from '@nextui-org/card';
import { Drawer, DrawerContent, DrawerBody, DrawerHeader } from '@nextui-org/drawer';
import feather from 'feather-icons';

import { useController } from '~/shared/hooks/useController';
import { Menu } from '~/components/ui/menu';
import { PrimaryButton } from '~/components/ui/primary-button';
import { TabPane } from '~/components/features/tab-pane';

import { PeersController } from './controller';
import { Connection } from './components/connection';

export const Peers = observer(() => {
  const ctrl = useController(PeersController);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <h1 className="typography mb-4">Your peers</h1>
      {!ctrl.hasAnyPeer && <div>You have no any peers yet</div>}
      <ul className="flex flex-col gap-2">
        {ctrl.peers.map(({ id, avatarSrc, firstName, lastName }) => (
          <Menu
            key={id}
            items={[
              {
                key: 'delete',
                view: 'Delete',
                color: 'danger',
                action: ctrl.forgetPeer,
              },
            ]}
            dropdownProps={{
              placement: 'bottom-end',
            }}
          >
            <li>
              <Card className="w-full">
                <CardBody className="flex flex-row justify-between items-center">
                  <User
                    avatarProps={{
                      src: avatarSrc,
                    }}
                    name={`${firstName} ${lastName}`}
                  />
                  <div className="flex gap-2 items-center h-fit">
                    {ctrl.isUserConnected(id) && (
                      <span
                        className="text-success text-sm"
                        dangerouslySetInnerHTML={{ __html: feather.icons.wifi.toSvg({ class: 'size-4' }) }}
                      />
                    )}
                    {!ctrl.isUserConnected(id) && (
                      <span
                        className="text-default text-sm"
                        dangerouslySetInnerHTML={{ __html: feather.icons['wifi-off'].toSvg({ class: 'size-4' }) }}
                      />
                    )}
                  </div>
                </CardBody>
              </Card>
            </li>
          </Menu>
        ))}
      </ul>
      <TabPane>
        <div className="aspect-square">
          <PrimaryButton isIconOnly className="text-foreground rounded-full !size-full" onPress={onOpen}>
            <span dangerouslySetInnerHTML={{ __html: feather.icons['user-plus'].toSvg() }} />
          </PrimaryButton>
        </div>
      </TabPane>
      <Drawer isOpen={isOpen} placement="bottom" backdrop="opaque" size="5xl" onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>Connect to peer</DrawerHeader>
              <DrawerBody className="pb-4">
                <Connection onConnected={onClose} />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
});
