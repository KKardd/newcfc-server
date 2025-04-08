export const transferNumberFormat = (val?: number | null, options?: Intl.NumberFormatOptions): string | unknown => {
  const numberFormat = new Intl.NumberFormat('en', options);

  if (val === null || val === undefined) {
    return val;
  }

  return numberFormat.format(val);
};

export const decimalExponentialRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)(E[+-]?\d+)?$/;

export const formatDecimalString = (value: string): string => {
  if (!value.includes('.')) {
    return value;
  }

  const split = value.split('.');
  const integer = split[0];
  let decimal = split[1];

  decimal = decimal.replace(/0+$/, '');

  while (decimal.length < 3) {
    decimal += '0';
  }

  return `${integer}.${decimal}`;
};
