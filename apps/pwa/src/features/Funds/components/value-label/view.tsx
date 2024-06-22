import cn from 'classnames';
import { asMoney } from '../../../../../../../libs/formatting/money';

export interface ValueLabelProps {
  capacity: number;
  balance: number;
  dailyRemainder: number | null;
}

export const ValueLabel = (props: ValueLabelProps) => {
  const { balance, capacity, dailyRemainder } = props;
  const label = `${asMoney(balance)} of ${asMoney(capacity)}`;

  if (dailyRemainder === null) {
    return label;
  }

  const remainderText = `(${asMoney(dailyRemainder)} today)`;

  return (
    <span>
      <span
        className={cn({
          'text-red-500': dailyRemainder < 0,
          'text-green-500': dailyRemainder >= 0,
        })}
      >
        {remainderText}
      </span>
      &nbsp;
      {label}
    </span>
  );
};
