import { useState } from 'react';
import { ButtonGroup, Button } from '@nextui-org/button';

export type TypeOfRecordValue = 'income' | 'cost';

export interface TypeOfRecordProps {
  defaultValue: TypeOfRecordValue;
  onChange(value: TypeOfRecordValue): void;
}

export const TypeOfRecord = (props: TypeOfRecordProps) => {
  const { defaultValue, onChange } = props;
  const [value, setValue] = useState<TypeOfRecordValue>(defaultValue);

  const handleButtonClick = (value: TypeOfRecordValue) => {
    setValue(value);
    onChange(value);
  };

  return (
    <ButtonGroup fullWidth size="lg">
      <Button
        className="uppercase"
        variant={value === 'income' ? 'bordered' : 'ghost'}
        color={value === 'income' ? 'success' : 'default'}
        onClick={handleButtonClick.bind(null, 'income')}
      >
        Income
      </Button>
      <Button
        className="uppercase"
        variant={value === 'cost' ? 'bordered' : 'ghost'}
        color={value === 'cost' ? 'danger' : 'default'}
        onClick={handleButtonClick.bind(null, 'cost')}
      >
        Expense
      </Button>
    </ButtonGroup>
  );
};
