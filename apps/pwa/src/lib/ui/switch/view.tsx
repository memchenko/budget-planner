import { Switch as BaseSwitch, SwitchProps as BaseSwitchProps } from '@nextui-org/switch';
import { PropsWithChildren, forwardRef } from 'react';

export interface SwitchProps extends PropsWithChildren<{}>, BaseSwitchProps {}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const { children, ...baseSwitchProps } = props;

  if (!children) {
    return <BaseSwitch ref={ref} size="lg" {...baseSwitchProps} />;
  }

  return (
    <label className="flex justify-between items-center">
      <span className="typography text-lg">{children}</span>
      <BaseSwitch ref={ref} size="lg" {...baseSwitchProps} />
    </label>
  );
});
