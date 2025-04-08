import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationPipeOptions } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { ValidationError, ValidationOptions, validate } from 'class-validator';

@Injectable()
export class GlobalValidation implements PipeTransform<unknown> {
  constructor(options?: ValidationPipeOptions) {
    this.options = options;
  }

  private options?: ValidationOptions;

  async transform(value: object, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const model = Object.assign(value);

    for (const property in model) {
      if (model[property] == 'null') {
        model[property] = null;
      }
    }

    const newModel = plainToInstance(metatype, model, {
      enableImplicitConversion: true,
    });
    const errors = await validate(newModel, this.options);

    if (errors.length > 0) {
      const messageItems = this.formatErrors(errors);
      throw new BadRequestException(messageItems.join('\r\n'));
    }

    return newModel;
  }

  private toValidate(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const result: string[] = [];
    errors.forEach((error) => {
      if (error.constraints) {
        for (const constraintKey in error.constraints) {
          result.push(`${error.property}: ${error.constraints[constraintKey]}`);
        }
      }
      if (error.children && error.children.length > 0) {
        result.push(...this.formatErrors(error.children));
      }
    });
    return result;
  }
}
