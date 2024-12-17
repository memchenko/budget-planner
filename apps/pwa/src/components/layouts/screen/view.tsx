import styles from './styles.module.css';

export const Screen = (props: React.PropsWithChildren) => {
  return <div className={styles.screen}>{props.children}</div>;
};
