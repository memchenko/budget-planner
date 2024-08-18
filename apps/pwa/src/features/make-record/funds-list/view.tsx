import { observer } from 'mobx-react-lite';
import { FundsListController } from './controller';
import { useController } from '../../../lib/hooks/useController';
import { RadioGroup, Radio } from '@nextui-org/radio';

export interface FundsListProps {
  onChange: (id: string) => void;
}

export const FundsList = observer((props: FundsListProps) => {
  const ctrl = useController(FundsListController);

  return (
    <RadioGroup onValueChange={props.onChange}>
      {ctrl.allFunds.map(({ id, title }) => (
        <Radio key={id} value={id} size="lg" color="primary">
          {title}
        </Radio>
      ))}
    </RadioGroup>
  );
});
