import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { MainController } from './controller';
import { MainFund } from '../../features/MainFund';
import { AddFund } from '../../features/AddFund';
import { Screen } from '../../layouts/screen';

export const Main = observer(() => {
  useController(MainController);

  return (
    <Screen>
      <MainFund />
      <AddFund />
    </Screen>
  );
});
