export const asMoney = (value: number) => {
  return Intl.NumberFormat().format(value);
};
