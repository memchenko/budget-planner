import { observer } from 'mobx-react-lite';
import { useNavigate, generatePath } from 'react-router-dom';
import { CircularProgress } from '@nextui-org/progress';
import { pages } from '~/shared/app/pages';
import { useController } from '~/shared/hooks/useController';
import { MainController } from './controller';
import { Wallet } from '~/components/features/wallets';
import { Funds } from '~/components/features/funds';
import { Screen } from '~/components/layouts/screen';
import { MakeRecord } from '~/components/features/make-record';

export const Main = observer(() => {
  const ctrl = useController(MainController, true);
  const navigate = useNavigate();

  const handleFundClick = (id: string) => {
    navigate(generatePath(pages.editFund, { id }));
  };

  const handleAddNewFundClick = () => {
    navigate(generatePath(pages.addFund));
  };

  if (ctrl.isLoading) {
    return (
      <Screen>
        <CircularProgress isIndeterminate />
      </Screen>
    );
  }

  return (
    <Screen>
      <Wallet />
      <Funds onFundClick={handleFundClick} onAddNewFund={handleAddNewFundClick} />
      <MakeRecord />
      <button onClick={() => navigate(pages.p2pSynchronization)}>Synchronize</button>
    </Screen>
  );
});
