import { Transform, TransformOptions } from 'class-transformer';

import { transferNumberFormat } from '@/util/digit';

export const TransformEntity = <T>(transformFn: (value: T) => unknown, options?: TransformOptions): PropertyDecorator => {
  return Transform(
    (params) => {
      return transformFn(params.obj as T);
    },
    {
      ...options,
      toClassOnly: true,
    },
  );
};

export const TransformBoolStringToBoolean = (): PropertyDecorator => {
  return Transform(({ value }) => {
    return value.toLowerCase() === 'true';
  });
};

export const TransformNumberFormat = (min: number = 0, max: number = 10): PropertyDecorator => {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const numberValue = Number(value.replace(/,/g, ''));

      return transferNumberFormat(numberValue, { minimumFractionDigits: min, maximumFractionDigits: max });
    } else if (typeof value === 'number') {
      return transferNumberFormat(value, { minimumFractionDigits: min, maximumFractionDigits: max });
    } else {
      return value;
    }
  });
};

export const TransformToDefaultString = (defaultValue: string = ''): PropertyDecorator => {
  return Transform(({ value }) => value ?? defaultValue);
};

export const TransformStringToNumber = (): PropertyDecorator => {
  return Transform(({ value }) => {
    if (value == null) {
      return null;
    }

    const number = Number(value);

    if (isNaN(number)) {
      return null;
    }

    return number;
  });
};

export const TransformSortCondition = (): PropertyDecorator => {
  return Transform(({ value }) => {
    return value
      .split(',')
      .map((sort: string) => {
        const [key, order] = sort.split('+');

        return { [key]: order };
      })
      .reduce((acc: object, cur: object) => ({ ...acc, ...cur }), {});
  });
};
