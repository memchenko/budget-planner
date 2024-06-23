import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { MainController } from './controller';
import { MainFund } from '../../features/main-fund';
import { AddFund } from '../../features/add-fund';
import { Funds } from '../../features/funds';
import { Screen } from '../../layouts/screen';

export const Main = observer(() => {
  const ctrl = useController(MainController);

  return (
    <Screen>
      <MainFund />
      {ctrl.shouldDisplayFunds && <Funds />}
      <AddFund />
    </Screen>
  );
});
