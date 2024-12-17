import { ButtonGroup, Button } from '@nextui-org/button';

export type TypeOfRecordValue = 'income' | 'cost';

export interface TypeOfRecordProps {
  value: TypeOfRecordValue;
  onChange(value: TypeOfRecordValue): void;
}

export const TypeOfRecord = (props: TypeOfRecordProps) => {
  const { value, onChange } = props;

  return (
    <ButtonGroup fullWidth size="lg">
      <Button
        className="uppercase"
        variant={value === 'income' ? 'bordered' : 'ghost'}
        color={value === 'income' ? 'success' : 'default'}
        onClick={onChange.bind(null, 'income')}
      >
        Income
      </Button>
      <Button
        className="uppercase"
        variant={value === 'cost' ? 'bordered' : 'ghost'}
        color={value === 'cost' ? 'danger' : 'default'}
        onClick={onChange.bind(null, 'cost')}
      >
        Expense
      </Button>
    </ButtonGroup>
  );
};
