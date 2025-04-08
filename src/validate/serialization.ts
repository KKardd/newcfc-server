import { ClassTransformOptions } from 'class-transformer/types/interfaces/class-transformer-options.interface';

export const classTransformDefaultOptions: ClassTransformOptions = {
  strategy: 'exposeAll',
  enableImplicitConversion: true,
  excludeExtraneousValues: true,
};
