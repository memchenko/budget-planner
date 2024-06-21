import { Card, CardHeader } from '@nextui-org/card';
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
    </Card>
  );
});
