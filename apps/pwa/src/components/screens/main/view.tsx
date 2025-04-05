import { observer } from 'mobx-react-lite';
import { CircularProgress } from '@nextui-org/progress';
import { useController } from '~/shared/hooks/useController';
import { MainController } from './controller';
import { Wallet } from '~/components/features/wallets';
import { Funds } from '~/components/features/funds';
import { Column } from '~/components/layouts/column';
import { TabPane } from '~/components/features/tab-pane';

export const Main = observer(() => {
  const ctrl = useController(MainController, true);

  if (ctrl.isLoading) {
    return (
      <Column>
        <CircularProgress isIndeterminate />
      </Column>
    );
  }

  return (
    <Column>
      {ctrl.isSyncing && <CircularProgress isIndeterminate size="sm" />}
      <Wallet />
      <Funds onFundClick={ctrl.handleFundClick} onAddNewFund={ctrl.handleAddNewFundClick} />
      <button onClick={ctrl.handleSynchronizeClick}>Synchronize</button>
      <TabPane />
    </Column>
  );
});
