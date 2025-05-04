import { ButtonGroup, Button } from '@nextui-org/button';
import { t } from '~/shared/translations';

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
        onPress={onChange.bind(null, 'income')}
      >
        {t('Income')}
      </Button>
      <Button
        className="uppercase"
        variant={value === 'cost' ? 'bordered' : 'ghost'}
        color={value === 'cost' ? 'danger' : 'default'}
        onPress={onChange.bind(null, 'cost')}
      >
        {t('Expense')}
      </Button>
    </ButtonGroup>
  );
};
