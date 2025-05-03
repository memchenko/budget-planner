import { observer } from 'mobx-react-lite';
import { CircularProgress } from '@nextui-org/progress';
import { Drawer, DrawerContent } from '@nextui-org/drawer';
import { useDisclosure } from '@nextui-org/react';
import feather from 'feather-icons';
import { useController } from '~/shared/hooks/useController';
import { MainController } from './controller';
import { Wallet } from '~/components/features/wallets';
import { Funds } from '~/components/features/funds';
import { Column } from '~/components/layouts/column';
import { TabPane } from '~/components/features/tab-pane';
import { MakeRecord } from '~/components/features/make-record';
import { PrimaryButton } from '~/components/ui/primary-button';

export const Main = observer(() => {
  const ctrl = useController(MainController);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (ctrl.isLoading) {
    return (
      <div className="h-full w-full flex justify-center align-middle">
        <CircularProgress isIndeterminate size="lg" />
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Column>
        <Wallet />
        <Funds onAddNewFund={ctrl.handleAddNewFundClick} />
        <TabPane>
          <div className="aspect-square">
            <PrimaryButton isIconOnly className="text-foreground rounded-full !size-full" onPress={onOpen}>
              <span dangerouslySetInnerHTML={{ __html: feather.icons.plus.toSvg() }} />
            </PrimaryButton>
          </div>
        </TabPane>
        <Drawer isOpen={isOpen} placement="bottom" backdrop="opaque" size="5xl" onOpenChange={onOpenChange}>
          <DrawerContent>{(onClose) => <MakeRecord onFinish={onClose} />}</DrawerContent>
        </Drawer>
      </Column>
    </div>
  );
});
