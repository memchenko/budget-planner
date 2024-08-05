import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { DotsVerticalIcon } from '../../../../lib/ui/icons/DotsVertical';

export interface MenuProps {
  onChangePriority: VoidFunction;
}

export const Menu = (props: MenuProps) => {
  const { onChangePriority } = props;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" startContent={<DotsVerticalIcon className="size-8" />} />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Funds menu actions"
        onAction={(key) => {
          if (key === 'order') {
            onChangePriority();
          }
        }}
      >
        <DropdownItem key="order">Reprioritize</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
