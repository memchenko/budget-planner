import { PropsWithChildren } from 'react';
import cn from 'classnames';
import {
  Dropdown,
  DropdownProps,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownItemProps,
} from '@nextui-org/dropdown';

export type MenuProps = PropsWithChildren<{
  items: Item[];
  dropdownProps?: Omit<DropdownProps, 'children'>;
}>;

export type Item = {
  key: string;
  view: PropsWithChildren['children'];
  color?: DropdownItemProps['color'];
  action: VoidFunction;
};

export const Menu = (props: MenuProps) => {
  const { items, children, dropdownProps } = props;

  return (
    <Dropdown backdrop="opaque" {...dropdownProps}>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu
        className="w-full"
        onAction={(key) => {
          const handler = items.find((item) => item.key === key);

          handler?.action();
        }}
        itemClasses={{
          base: 'w-full',
          title: 'text-xl',
        }}
      >
        {items.map(({ key, view, color }) => (
          <DropdownItem
            key={key}
            className={cn({
              'text-danger': color === 'danger',
            })}
            color={color}
          >
            {view}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
