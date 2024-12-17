import { Card, CardHeader, CardFooter } from '@nextui-org/card';
import { ButtonGroup } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { observer } from 'mobx-react-lite';
import { WalletIcon } from '~/lib/ui/icons/Wallet';
import { PencilIcon } from '~/lib/ui/icons/Pencil';
import { TrashIcon } from '~/lib/ui/icons/Trash';
import { CheckIcon } from '~/lib/ui/icons/Check';
import { CardButton } from '~/lib/ui/card-button';
import { useController } from '~/lib/hooks/useController';
import { EditBalanceIcon } from '~/lib/ui/icons/EditBalance';
import { CardTitle } from '~/lib/ui/card-title';
import { WalletController } from './controller';
import styles from './styles.module.css';

export const Wallet = observer(() => {
  const ctrl = useController(WalletController);

  return (
    <Card className="card">
      <CardHeader className={styles.header}>
        {ctrl.isEditing ? (
          <Input
            label={ctrl.isBalanceChangeMode ? 'New balance' : 'New title'}
            value={ctrl.inputValue}
            onValueChange={ctrl.handleInputChange}
          />
        ) : (
          <>
            <CardTitle className={styles.name}>
              <WalletIcon className={styles.wallet} />
              {ctrl.title}
            </CardTitle>
            <p className={styles.balance}>{ctrl.formattedBalance}</p>
          </>
        )}
      </CardHeader>
      <Divider className="line" />
      <CardFooter className={styles.footer}>
        <ButtonGroup fullWidth variant="light" size="lg" radius="lg" className={styles.buttonGroup}>
          <CardButton
            icon={ctrl.isEditing ? <TrashIcon className="size-5" /> : <PencilIcon className="size-5" />}
            onClick={ctrl.handleLeftButtonClick}
          >
            {ctrl.isEditing ? 'Cancel' : 'Change title'}
          </CardButton>
          <Divider className="line h-12" orientation="vertical" />
          <CardButton
            icon={ctrl.isEditing ? <CheckIcon className="size-6" /> : <EditBalanceIcon className="size-6" />}
            onClick={ctrl.handleRightButtonClick}
          >
            {ctrl.isEditing ? 'Confirm' : 'Edit balance'}
          </CardButton>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
});
