import { Progress } from '@nextui-org/progress';
import { Card, CardBody } from '@nextui-org/card';
import cn from 'classnames';

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
  }[];
  onFundClick: (id: string) => void;
}

export const FundsState = (props: FundsStateProps) => {
  const { list, onFundClick } = props;

  return (
    <>
      {list.map(({ id, title, balance, capacity, dailyRemainder, remainderLeft, remainderWidth }) => {
        return (
          <Card key={id} isPressable className="flex items-end gap-2" onClick={onFundClick.bind(null, id)}>
            <CardBody>
              <Progress
                showValueLabel
                label={title}
                value={balance}
                valueLabel={<ValueLabel capacity={capacity} balance={balance} dailyRemainder={dailyRemainder} />}
                maxValue={capacity}
                classNames={{
                  indicator: cn(styles.indicator, {
                    [styles.insufficientRemainder]: remainderLeft === '100%',
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
      })}
    </>
  );
};
