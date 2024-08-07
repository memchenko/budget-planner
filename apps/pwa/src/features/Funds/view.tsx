import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { CardTitle } from '../../lib/ui/card-title';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { FundsController, Mode } from './controller';
import { FundsState } from './components/funds-state';
import { FundsOrder } from './components/funds-order';
import { Menu } from './components/menu';

export const Funds = observer(() => {
  const ctrl = useController(FundsController);

  return (
    <Card className="card">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Funds</CardTitle>
        <Menu onChangePriority={ctrl.enableReorderMode} onDistribute={ctrl.distribute} />
      </CardHeader>
      <CardBody className="flex gap-4 flex-col">
        {ctrl.mode === Mode.View && <FundsState list={ctrl.funds} />}
        {ctrl.mode === Mode.Reorder && (
          <FundsOrder list={ctrl.funds} onConfirm={ctrl.reprioiritize} onCancel={ctrl.enableViewMode} />
        )}
      </CardBody>
    </Card>
  );
});
