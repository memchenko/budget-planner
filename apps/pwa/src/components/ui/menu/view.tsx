import { PropsWithChildren } from 'react';
import cn from 'classnames';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownItemProps } from '@nextui-org/dropdown';

export type MenuProps = PropsWithChildren<{
  items: Item[];
}>;

export type Item = {
  title: string;
  color?: DropdownItemProps['color'];
  action: VoidFunction;
};

export const Menu = (props: MenuProps) => {
  const { items, children } = props;

  return (
    <Dropdown backdrop="opaque">
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu
        className="w-full"
        onAction={(title) => {
          const handler = items.find((item) => item.title === title);

          handler?.action();
        }}
        itemClasses={{
          base: 'w-full',
          title: 'text-xl',
        }}
      >
        {items.map(({ title, color }) => (
          <DropdownItem
            key={title}
            className={cn({
              'text-danger': color === 'danger',
            })}
            color={color}
          >
            {title}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
