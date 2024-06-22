import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import cn from 'classnames';
import { CardTitle } from '../../lib/ui/card-title';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { FundsController } from './controller';
import styles from './styles.module.css';

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
            <li key={fund.id}>
              <Progress
                showValueLabel
                label={fund.title}
                value={fund.balance}
                valueLabel={fund.ratioText}
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
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
});
