import { Button, ButtonProps } from '@nextui-org/button';
import cn from 'classnames';

export const DangerButton = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return (
    <Button
      className={cn('bg-danger uppercase typography text-xl font-semibold text-primary-50', className)}
      size="lg"
      {...restProps}
    />
  );
};
