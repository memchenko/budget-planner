import { observer } from 'mobx-react-lite';
import { useNavigate, generatePath } from 'react-router-dom';
import { pages } from '../../lib/app/pages';
import { useController } from '../../lib/hooks/useController';
import { MainController } from './controller';
import { MainFund } from '../../features/main-fund';
import { AddFund } from '../../features/add-fund';
import { Funds } from '../../features/funds';
import { Screen } from '../../layouts/screen';
import { MakeRecord } from '../../features/make-record';

export const Main = observer(() => {
  const ctrl = useController(MainController);
  const navigate = useNavigate();

  const handleFundClick = (id: string) => {
    navigate(generatePath(pages.editFund, { id }));
  };

  return (
    <Screen>
      <MainFund />
      {ctrl.shouldDisplayFunds && <Funds onFundClick={handleFundClick} />}
      <AddFund />
      <MakeRecord />
    </Screen>
  );
});
