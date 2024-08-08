import { Button, ButtonProps } from '@nextui-org/button';
import cn from 'classnames';

export const PrimaryButton = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return (
    <Button
      className={cn('bg-primary uppercase typography text-xl font-semibold text-primary-50', className)}
      size="lg"
      {...restProps}
    />
  );
};
