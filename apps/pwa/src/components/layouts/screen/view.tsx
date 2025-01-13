import styles from './styles.module.css';
import { Modal } from '~/components/features/modal';
import { Notification } from '~/components/features/notification';

export const Screen = (props: React.PropsWithChildren) => {
  return (
    <div className={styles.screen}>
      {props.children}
      <Modal />
      <Notification />
    </div>
  );
};
