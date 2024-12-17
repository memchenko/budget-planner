import { observer } from 'mobx-react-lite';
import { useNavigate, generatePath } from 'react-router-dom';
import { CircularProgress } from '@nextui-org/progress';
import { pages } from '~/lib/app/pages';
import { useController } from '~/lib/hooks/useController';
import { MainController } from './controller';
import { Wallet } from '~/features/wallets';
import { Funds } from '~/features/funds';
import { Screen } from '~/layouts/screen';
import { MakeRecord } from '~/features/make-record';

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
