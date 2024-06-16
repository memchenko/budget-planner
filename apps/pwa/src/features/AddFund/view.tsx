import { NavLink } from 'react-router-dom';
import { Card } from '@nextui-org/card';
import { PlusIcon } from '../../lib/ui/icons/Plus';
import styles from './styles.module.css';

export const AddFund = () => {
  return (
    <Card isBlurred isPressable isHoverable shadow="sm" className={styles.addFund} as={NavLink} to={'/fund/new'}>
      <PlusIcon className="h-8 w-8" pathClassName="stroke-primary-900 text-white" />
      <span className="text-2xl font-sans text-primary-900 text-md uppercase text-center">Add fund</span>
    </Card>
  );
};
