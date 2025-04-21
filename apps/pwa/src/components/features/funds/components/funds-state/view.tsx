import { Progress } from '@nextui-org/progress';
import { Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, CardBody } from '@nextui-org/card';
import cn from 'classnames';
import { Menu } from '~/components/ui/menu';
import { useController } from '~/shared/hooks/useController';
import { FundsStateController } from './controller';

import { ValueLabel } from '../value-label';
import styles from './styles.module.css';

export interface FundsStateProps {
  list: {
    id: string;
    title: string;
    balance: number;
    capacity: number;
    dailyRemainder: number | null;
    remainderLeft: string | null;
    remainderWidth: string | null;
    isExternal: boolean;
  }[];
}

export const FundsState = observer((props: FundsStateProps) => {
  const { list } = props;
  const ctrl = useController(FundsStateController);

  return (
    <>
      {list.map(({ id, isExternal, title, balance, capacity, dailyRemainder, remainderLeft, remainderWidth }) => {
        let view = (
          <Card
            className={cn('flex items-end gap-2', {
              ['border-2']: isExternal,
              ['border-lime-500']: isExternal,
            })}
          >
            <CardBody>
              <Progress
                showValueLabel
                label={title}
                value={balance}
                valueLabel={<ValueLabel capacity={capacity} balance={balance} dailyRemainder={dailyRemainder} />}
                maxValue={capacity}
                classNames={{
                  indicator: cn(styles.indicator, {
                    [styles.insufficientRemainder]: remainderLeft === '100%' && dailyRemainder !== null,
                  }),
                }}
                style={
                  {
                    '--remainder-width': `${remainderWidth}`,
                    '--remainder-left': `${remainderLeft}`,
                  } as React.CSSProperties
                }
                color="primary"
                size="lg"
              />
            </CardBody>
          </Card>
        );

        if (ctrl.shouldDisplayMenu) {
          view = (
            <Menu
              items={ctrl.getMenu(id)}
              dropdownProps={{
                closeOnSelect: false,
                onClose: ctrl.reset,
                placement: 'bottom-end',
              }}
            >
              {view}
            </Menu>
          );
        }

        return <Fragment key={id}>{view}</Fragment>;
      })}
    </>
  );
});
