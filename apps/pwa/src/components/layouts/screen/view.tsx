import styles from './styles.module.css';
import { Modal } from '~/components/features/modal';
import { Notification } from '~/components/features/notification';
import { Outlet } from 'react-router-dom';

export const Screen = () => {
  return (
    <div className={styles.screen}>
      <Outlet />
      <Modal />
      <Notification />
    </div>
  );
};
