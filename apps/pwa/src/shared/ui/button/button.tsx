import { Button as BaseButton, ButtonProps } from '@nextui-org/button';
import cn from 'classnames';

export const Button = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return (
    <BaseButton className={cn('uppercase typography text-xl font-semibold', className)} size="lg" {...restProps} />
  );
};
