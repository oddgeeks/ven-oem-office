import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommonString } from '../strings/common.string';
import { SetCurrentTenant } from '../decorators/set-current-tenant.decorator';

@Injectable()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@SetCurrentTenant
export abstract class IsExists<T> implements ValidatorConstraintInterface {
  protected constructor(protected readonly repo: Repository<T>) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    try {
      const res = await this.repo.findOne({
        where: { [args.property]: args.value, isEnabled: true },
      });
      return !res;
    } catch (e) {
      throw new BadRequestException(CommonString.CANNOT_VALIDATE);
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${
      this.repo.metadata.targetName
    } ${CommonString.NOT_FOUND.toLowerCase()}`;
  }
}

/*export function IsExistsValidator(validationOptions?: ValidationOptions) {
  return function (obj: any, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsExistsConstraint,

    });
  };
}*/
