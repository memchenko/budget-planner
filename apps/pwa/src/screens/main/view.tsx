import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { MainController } from './controller';
import { MainFund } from '../../features/MainFund';
import { AddFund } from '../../features/AddFund';
import styles from './styles.module.css';

export const Main = observer(() => {
  useController(MainController);

  return (
    <div className={styles.main}>
      <MainFund />
      <AddFund />
    </div>
  );
});
