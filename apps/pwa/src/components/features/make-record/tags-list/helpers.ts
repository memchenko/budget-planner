import { ChipProps } from '@nextui-org/chip';

export const getTagColor = (tag: string): ChipProps['color'] => {
  const colors: ChipProps['color'][] = ['primary', 'success', 'warning', 'danger', 'secondary'];

  const tagCode = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[tagCode % colors.length];
};
