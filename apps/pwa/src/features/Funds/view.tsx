import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Button } from '@nextui-org/button';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import cn from 'classnames';
import { CardTitle } from '../../lib/ui/card-title';
import { DotsVerticalIcon } from '../../lib/ui/icons/DotsVertical';
import { GridDotsVerticalIcon } from '../../lib/ui/icons/GridDotsVertical';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { FundsController } from './controller';
import styles from './styles.module.css';
import { ValueLabel } from './components/value-label';

export const Funds = observer(() => {
  const ctrl = useController(FundsController);

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle>Funds</CardTitle>
      </CardHeader>
      <CardBody>
        <SortableList
          className="flex gap-4 flex-col"
          draggedItemClassName={styles.dragged}
          onSortEnd={ctrl.handleSortEnd}
        >
          {ctrl.funds.map((fund) => (
            <SortableItem key={fund.id}>
              <div className="flex items-end gap-2">
                <SortableKnob>
                  <div>
                    <GridDotsVerticalIcon className="size-8 text-foreground/40" />
                  </div>
                </SortableKnob>
                <Progress
                  showValueLabel
                  label={fund.title}
                  value={fund.balance}
                  valueLabel={
                    <ValueLabel capacity={fund.capacity} balance={fund.balance} dailyRemainder={fund.dailyRemainder} />
                  }
                  maxValue={fund.capacity}
                  classNames={{
                    indicator: cn(styles.indicator, {
                      [styles.insufficientRemainder]: fund.remainderGeometry.left === '100%',
                    }),
                  }}
                  style={
                    {
                      '--remainder-width': `${fund.remainderGeometry.width}`,
                      '--remainder-left': `${fund.remainderGeometry.left}`,
                    } as React.CSSProperties
                  }
                  color="primary"
                  size="lg"
                />
                <Button isIconOnly variant="light">
                  <DotsVerticalIcon className="text-foreground" />
                </Button>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </CardBody>
    </Card>
  );
});
