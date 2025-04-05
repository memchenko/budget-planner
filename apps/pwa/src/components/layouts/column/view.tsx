import { PropsWithChildren } from 'react';
import styles from './styles.module.css';

export const Column = (props: PropsWithChildren) => {
  return <div className={styles.column}>{props.children}</div>;
};
