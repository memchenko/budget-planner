import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@nextui-org/progress';
import { pages } from '~/shared/constants/pages';
import { useController } from '~/shared/hooks/useController';
import { MainController } from './controller';
import { Wallet } from '~/components/features/wallets';
import { Funds } from '~/components/features/funds';
import { Screen } from '~/components/layouts/screen';
import { MakeRecord } from '~/components/features/make-record';

export const Main = observer(() => {
  const ctrl = useController(MainController, true);
  const navigate = useNavigate();

  if (ctrl.isLoading) {
    return (
      <Screen>
        <CircularProgress isIndeterminate />
      </Screen>
    );
  }

  return (
    <Screen>
      {ctrl.isSyncing && <CircularProgress isIndeterminate size="sm" />}
      <Wallet />
      <Funds onFundClick={ctrl.handleFundClick} onAddNewFund={ctrl.handleAddNewFundClick} />
      <MakeRecord />
      <button onClick={() => navigate(pages.connection)}>Synchronize</button>
    </Screen>
  );
});
