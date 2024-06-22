export const asMoney = (value: number, currency?: string, locale?: string) => {
  const args: ConstructorParameters<typeof Intl.NumberFormat> = [];

  if (locale) {
    args.push(locale);
  }

  if (currency) {
    args.push({ style: 'currency', currency });
  }

  return new Intl.NumberFormat(...args).format(value);
};
