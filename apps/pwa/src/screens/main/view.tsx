import { observer } from 'mobx-react-lite';
import { useNavigate, generatePath } from 'react-router-dom';
import { pages } from '../../lib/app/pages';
import { useController } from '../../lib/hooks/useController';
import { MainController } from './controller';
import { MainFund } from '../../features/main-fund';
import { Funds } from '../../features/funds';
import { Screen } from '../../layouts/screen';
import { MakeRecord } from '../../features/make-record';

export const Main = observer(() => {
  useController(MainController);
  const navigate = useNavigate();

  const handleFundClick = (id: string) => {
    navigate(generatePath(pages.editFund, { id }));
  };

  const handleAddNewFundClick = () => {
    navigate(generatePath(pages.addFund));
  };

  return (
    <Screen>
      <MainFund />
      <Funds onFundClick={handleFundClick} onAddNewFund={handleAddNewFundClick} />
      <MakeRecord />
      <button onClick={() => navigate(pages.p2pSynchronization)}>Synchronize</button>
    </Screen>
  );
});
