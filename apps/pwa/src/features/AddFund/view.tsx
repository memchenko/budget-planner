import { NavLink } from 'react-router-dom';
import { Card } from '@nextui-org/card';
import { PlusIcon } from '../../lib/ui/icons/Plus';
import { PrimaryButton } from '../../lib/ui/primary-button';
import { pages } from '../../lib/app/pages';

export const AddFund = () => {
  return (
    <Card isPressable isHoverable replace shadow="sm" as={NavLink} to={pages.addFund}>
      <PrimaryButton fullWidth as="span" startContent={<PlusIcon className="size-8" />}>
        Add fund
      </PrimaryButton>
    </Card>
  );
};
