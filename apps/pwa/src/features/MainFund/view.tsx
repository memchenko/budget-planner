import { Card, CardHeader, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { observer } from 'mobx-react-lite';
import { WalletIcon } from '../../lib/ui/icons/Wallet';
import { PencilIcon } from '../../lib/ui/icons/Pencil';
import { TrashIcon } from '../../lib/ui/icons/Trash';
import { CheckIcon } from '../../lib/ui/icons/Check';
import { useController } from '../../lib/hooks/useController';
import { EditBalanceIcon } from '../../lib/ui/icons/EditBalance';
import { MainFundController } from './controller';
import styles from './styles.module.css';

export const MainFund = observer(() => {
  const ctrl = useController(MainFundController);

  return (
    <Card isBlurred isFooterBlurred className="transparent bg-background/80" shadow="sm">
      <CardHeader className="justify-between p-4">
        {ctrl.isBalanceChangeMode || ctrl.isTitleChangeMode ? (
          <Input
            label={ctrl.isBalanceChangeMode ? 'New balance' : 'New title'}
            variant="flat"
            value={
              ctrl.isBalanceChangeMode
                ? String(ctrl.newBalance ?? ctrl.mainFundBalance)
                : ctrl.newTitle ?? ctrl.mainFundTitle
            }
            onValueChange={ctrl.isBalanceChangeMode ? ctrl.handleNewBalanceInputChange : ctrl.handleNewTitleInputChange}
          />
        ) : (
          <>
            <h1 className="font-sans text-2xl text-primary-900 uppercase flex flex-row gap-4">
              <WalletIcon className="h-8 w-8" pathClassName="stroke-current" />
              {ctrl.mainFundTitle}
            </h1>
            <p className="font-sans text-primary-900 text-2xl">
              {new Intl.NumberFormat().format(ctrl.mainFundBalance ?? -1)}
            </p>
          </>
        )}
      </CardHeader>
      <Divider className="bg-primary-900/10" />
      <CardFooter className="bg-default-400/5 flex justify-center p-0">
        {!ctrl.isBalanceChangeMode && !ctrl.isTitleChangeMode && (
          <ButtonGroup fullWidth variant="light" size="lg" radius="lg" className={styles.buttonGroup}>
            <Button
              startContent={<PencilIcon className="h-5 w-5" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
              onClick={ctrl.handleChangeTitleClick}
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
        {(ctrl.isBalanceChangeMode || ctrl.isTitleChangeMode) && (
          <ButtonGroup fullWidth variant="light" size="lg" radius="lg" className={styles.buttonGroup}>
            <Button
              startContent={<TrashIcon className="h-5 w-5" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
              onClick={
                ctrl.isBalanceChangeMode ? ctrl.handleCancelEditBalanceClick : ctrl.handleCancelChangingTitleClick
              }
            >
              Cancel
            </Button>
            <Divider className="bg-primary-900/10 h-8" orientation="vertical" />
            <Button
              startContent={<CheckIcon className="h-6 w-6" pathClassName="stroke-current" />}
              className="font-sans text-primary-900 text-md uppercase text-center flex gap-1 items-center"
              onClick={ctrl.isBalanceChangeMode ? ctrl.handleConfirmBalanceClick : ctrl.handleConfirmTitleClick}
            >
              Confirm
            </Button>
          </ButtonGroup>
        )}
      </CardFooter>
    </Card>
  );
});
