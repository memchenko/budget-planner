import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Button } from '@nextui-org/button';
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
        <ul className="flex gap-4 flex-col">
          {ctrl.funds.map((fund) => (
            <li key={fund.id} className="flex items-end gap-2">
              <Button isIconOnly variant="light" size="sm">
                <GridDotsVerticalIcon className="size-8" pathClassName="stroke-foreground/40" />
              </Button>
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
                <DotsVerticalIcon pathClassName="stroke-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
});
