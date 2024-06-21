import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { CardTitle } from '../../lib/ui/card-title';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { FundsController } from './controller';

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
