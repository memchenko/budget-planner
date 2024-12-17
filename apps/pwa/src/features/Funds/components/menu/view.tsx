import { Button } from '@nextui-org/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { DotsVerticalIcon } from '~/lib/ui/icons/DotsVertical';

export interface MenuProps {
  onChangePriority: VoidFunction;
  onDistribute: VoidFunction;
}

export const Menu = (props: MenuProps) => {
  const { onChangePriority, onDistribute } = props;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" startContent={<DotsVerticalIcon className="size-8" />} />
      </DropdownTrigger>
      <DropdownMenu
        className="w-full"
        aria-label="Funds menu actions"
        onAction={(key) => {
          const handlers: Record<typeof key, VoidFunction> = {
            order: onChangePriority,
            distribute: onDistribute,
          };

          handlers[key]();
        }}
        itemClasses={{
          base: 'w-full',
          title: 'text-xl',
        }}
      >
        <DropdownItem key="distribute">Distribute</DropdownItem>
        <DropdownItem key="order">Reprioritize</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
