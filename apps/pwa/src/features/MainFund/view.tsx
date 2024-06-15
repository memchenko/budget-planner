import { Card, CardHeader, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { observer } from 'mobx-react-lite';
import { WalletIcon } from '../../lib/ui/icons/Wallet';
import { PencilIcon } from '../../lib/ui/icons/Pencil';
import { useController } from '../../lib/hooks/useController';
import { EditBalanceIcon } from '../../lib/ui/icons/EditBalance';
import { MainFundController } from './controller';
import styles from './styles.module.css';

export const MainFund = observer(() => {
  const ctrl = useController(MainFundController);

  return (
    <Card isBlurred isFooterBlurred className="transparent bg-background/50" shadow="sm">
      <CardHeader className="justify-between p-4">
        {ctrl.isBalanceChangeMode ? (
          <Input
            label="New balance"
            variant="flat"
            value={String(ctrl.newBalance ?? ctrl.mainFundBalance)}
            onValueChange={ctrl.handleInputChange}
          />
        ) : (
          <>
            <h1 className="font-sans text-2xl text-primary-900 uppercase flex flex-row gap-4">
              <WalletIcon className="h-8 w-8" pathClassName="stroke-current" />
              Your wallet
            </h1>
            <p className="font-sans text-primary-900 text-2xl">{ctrl.mainFundBalance}</p>
          </>
        )}
      </CardHeader>
      <Divider className="bg-primary-900/10" />
      <CardFooter className="bg-default-400/5 flex justify-center p-0">
        {!ctrl.isBalanceChangeMode && (
          <ButtonGroup fullWidth variant="light" size="lg" radius="lg" className={styles.buttonGroup}>
            <Button
              startContent={<PencilIcon className="h-5 w-5" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
            >
              Change title
            </Button>
            <Divider className="bg-primary-900/10 h-8" orientation="vertical" />
            <Button
              startContent={<EditBalanceIcon className="h-6 w-6" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
              onClick={ctrl.handleEditBalanceClick}
            >
              Edit balance
            </Button>
          </ButtonGroup>
        )}
        {ctrl.isBalanceChangeMode && (
          <ButtonGroup fullWidth variant="light" size="lg" radius="lg" className={styles.buttonGroup}>
            <Button
              startContent={<PencilIcon className="h-5 w-5" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
              onClick={ctrl.handleCancelEditBalanceClick}
            >
              Cancel
            </Button>
            <Divider className="bg-primary-900/10 h-8" orientation="vertical" />
            <Button
              startContent={<EditBalanceIcon className="h-6 w-6" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
              onClick={ctrl.handleConfirmBalanceClick}
            >
              Confirm
            </Button>
          </ButtonGroup>
        )}
      </CardFooter>
    </Card>
  );
});
