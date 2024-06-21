import { NavLink } from 'react-router-dom';
import { Card } from '@nextui-org/card';
import { PlusIcon } from '../../lib/ui/icons/Plus';
import { PrimaryButton } from '../../lib/ui/primary-button';
import styles from './styles.module.css';
import { pages } from '../../lib/app/pages';

export const AddFund = () => {
  return (
    <Card isPressable isHoverable shadow="sm" className={styles.addFund} as={NavLink} to={pages.addFund}>
      <PrimaryButton fullWidth as="span" startContent={<PlusIcon className={styles.icon} />}>
        Add fund
      </PrimaryButton>
    </Card>
  );
};
