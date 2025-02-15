import { observer } from 'mobx-react-lite';
import { CircularProgress } from '@nextui-org/progress';
import { useController } from '~/shared/hooks/useController';
import { MainController } from './controller';
import { Wallet } from '~/components/features/wallets';
import { Funds } from '~/components/features/funds';
import { Screen } from '~/components/layouts/screen';
import { MakeRecord } from '~/components/features/make-record';

export const Main = observer(() => {
  const ctrl = useController(MainController, true);

  if (ctrl.isLoading) {
    return (
      <div>
        <CircularProgress isIndeterminate />
      </div>
    );
  }

  return (
    <div>
      {ctrl.isSyncing && <CircularProgress isIndeterminate size="sm" />}
      <Wallet />
      <Funds onFundClick={ctrl.handleFundClick} onAddNewFund={ctrl.handleAddNewFundClick} />
      <MakeRecord />
      <button onClick={ctrl.handleSynchronizeClick}>Synchronize</button>
    </div>
  );
});
