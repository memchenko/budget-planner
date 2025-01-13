import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/hooks/useController';
import { ModalController } from './controller';
import {
  Modal as NextUIModal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  // useDisclosure,
} from '@nextui-org/modal';
// import { useEffect } from 'react';
import { PrimaryButton } from '~/components/ui/primary-button';
import { Button } from '~/components/ui/button';

export const Modal = observer(() => {
  const ctrl = useController(ModalController);
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // useEffect(() => {
  //   if (ctrl.isOpen) {
  //     onOpen();
  //   }
  // }, [ctrl.isOpen, onOpen]);

  return (
    <NextUIModal isDismissable={false} isOpen={ctrl.isOpen}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{ctrl.heading}</ModalHeader>
            <ModalBody>
              <p>{ctrl.body}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={() => {
                  ctrl.closeModal(false);
                }}
              >
                Close
              </Button>
              <PrimaryButton
                onPress={() => {
                  ctrl.closeModal(true);
                }}
              >
                Confirm
              </PrimaryButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextUIModal>
  );
});
