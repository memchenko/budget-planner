import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { CardTitle } from '../../lib/ui/card-title';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { FundsController, Mode } from './controller';
import { FundsState } from './components/funds-state';
import { FundsOrder } from './components/funds-order';
import { Menu } from './components/menu';
import { Button } from '../../lib/ui/button';

export interface FundsProps {
  onFundClick: (id: string) => void;
  onAddNewFund: () => void;
}

export const Funds = observer((props: FundsProps) => {
  const { onFundClick, onAddNewFund } = props;
  const ctrl = useController(FundsController);

  return (
    <Card className="card">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Funds</CardTitle>
        {ctrl.hasFunds && <Menu onChangePriority={ctrl.enableReorderMode} onDistribute={ctrl.distribute} />}
      </CardHeader>
      <CardBody className="flex gap-4 flex-col">
        {!ctrl.hasFunds && <p className="text-center p-4 text-foreground-300">No funds created yet</p>}
        {ctrl.mode === Mode.View && <FundsState list={ctrl.funds} onFundClick={onFundClick} />}
        {ctrl.mode === Mode.Reorder && (
          <FundsOrder list={ctrl.funds} onConfirm={ctrl.reprioiritize} onCancel={ctrl.enableViewMode} />
        )}
      </CardBody>
      <CardFooter className="p-0">
        <Button
          fullWidth
          variant="bordered"
          className="!rounded-t-none border-b-0 border-x-0 border-t-1"
          onClick={onAddNewFund}
        >
          Add fund
        </Button>
      </CardFooter>
    </Card>
  );
});
