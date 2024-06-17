import { NavLink } from 'react-router-dom';
import { Card } from '@nextui-org/card';
import { PlusIcon } from '../../lib/ui/icons/Plus';
import styles from './styles.module.css';
import { pages } from '../../lib/app/pages';
import { CardTitle } from '../../lib/ui/card-title';

export const AddFund = () => {
  return (
    <Card isBlurred isPressable isHoverable className={styles.addFund} as={NavLink} to={pages.addFund}>
      <PlusIcon className={styles.icon} />
      <CardTitle className={styles.call}>Add fund</CardTitle>
    </Card>
  );
};
