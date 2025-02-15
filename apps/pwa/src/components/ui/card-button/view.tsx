import { PropsWithChildren } from 'react';
import { Button } from '@nextui-org/button';
import styles from './styles.module.css';

export interface CardButtonProps extends PropsWithChildren<{}> {
  icon: React.ReactNode;
  onClick: () => void;
}

export const CardButton = (props: CardButtonProps) => {
  return (
    <Button startContent={props.icon} className={styles.button} onPress={props.onClick}>
      {props.children}
    </Button>
  );
};
