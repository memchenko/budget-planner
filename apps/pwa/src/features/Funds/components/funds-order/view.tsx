import { useState, Fragment } from 'react';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import { GridDotsVerticalIcon } from '~/lib/ui/icons/GridDotsVertical';
import styles from './styles.module.css';

export interface FundsOrderProps {
  list: {
    id: string;
    title: string;
  }[];
  onConfirm: (list: string[]) => void;
  onCancel: VoidFunction;
}

export const FundsOrder = (props: FundsOrderProps) => {
  const [items, setItems] = useState(props.list);

  const handleSortEnd = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const elementToMove = newItems.splice(fromIndex, 1)[0];
    newItems.splice(toIndex, 0, elementToMove);

    setItems(newItems);
  };
  const handleButtonClick = () => {
    props.onConfirm(items.map((item) => item.id));
  };

  return (
    <div>
      <SortableList onSortEnd={handleSortEnd}>
        {items.map(({ id, title }) => (
          <Fragment key={id}>
            <SortableItem>
              <div className={styles.item}>
                <div>{title}</div>
                <SortableKnob>
                  <GridDotsVerticalIcon className="size-8" />
                </SortableKnob>
              </div>
            </SortableItem>
            <Divider />
          </Fragment>
        ))}
      </SortableList>
      <div className={styles.actions}>
        <Button className="w-1/4" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button color="primary" className="w-1/4" onClick={handleButtonClick}>
          Save
        </Button>
      </div>
    </div>
  );
};
