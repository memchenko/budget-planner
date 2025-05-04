import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { CardTitle } from '~/components/ui/card-title';
import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/hooks/useController';
import { FundsController, Mode } from './controller';
import { FundsState } from './components/funds-state';
import { FundsOrder } from './components/funds-order';
import { FundActionsMenu } from './components/fund-actions-menu';
import { Button } from '~/components/ui/button';
import { t } from '~/shared/translations';

export interface FundsProps {
  onAddNewFund: () => void;
}

export const Funds = observer((props: FundsProps) => {
  const { onAddNewFund } = props;
  const ctrl = useController(FundsController);

  return (
    <Card className="card">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{t('Funds')}</CardTitle>
        {ctrl.hasFunds && <FundActionsMenu onChangePriority={ctrl.enableReorderMode} onDistribute={ctrl.distribute} />}
      </CardHeader>
      <CardBody className="flex gap-4 flex-col">
        {!ctrl.hasFunds && <p className="text-center p-4 text-foreground-300">No funds created yet</p>}
        {ctrl.mode === Mode.View && <FundsState list={ctrl.funds} />}
        {ctrl.mode === Mode.Reorder && (
          <FundsOrder list={ctrl.funds} onConfirm={ctrl.reprioiritize} onCancel={ctrl.enableViewMode} />
        )}
      </CardBody>
      <CardFooter className="p-0">
        <Button
          fullWidth
          variant="bordered"
          className="!rounded-t-none border-b-0 border-x-0 border-t-1"
          onPress={onAddNewFund}
        >
          Add fund
        </Button>
      </CardFooter>
    </Card>
  );
});
