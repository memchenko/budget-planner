import { Button } from '@nextui-org/button';
import { DotsVerticalIcon } from '~/components/ui/icons/DotsVertical';
import { Menu } from '~/components/ui/menu';

export interface FundActionsMenuProps {
  onChangePriority: VoidFunction;
  onDistribute: VoidFunction;
}

export const FundActionsMenu = (props: FundActionsMenuProps) => {
  const { onChangePriority, onDistribute } = props;

  return (
    <Menu
      items={[
        {
          key: 'distribute',
          view: 'Distribute',
          action: onDistribute,
        },
        {
          key: 'reprioritize',
          view: 'Reprioritize',
          action: onChangePriority,
        },
      ]}
    >
      <Button isIconOnly variant="light" startContent={<DotsVerticalIcon className="size-8" />} />
    </Menu>
  );
};
