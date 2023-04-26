import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

import { OemRoleEntity } from '../oem-role.entity';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'IsPriorityAlreadyExist', async: false })
@Injectable()
@SetCurrentTenant
export class IsPriorityAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(OemRoleEntity)
    private readonly repo: Repository<OemRoleEntity>,
  ) {}

  async validate(
    priority: number,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    try {
      const role = await this.repo.findOne({
        where: {
          priority,
          isEnabled: true,
        },
      });
      return !role;
    } catch (e) {
      throw new BadRequestException('Cannot validate role');
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'This priority is busy.';
  }
}

//something wrong with identifying default message so we use this trick
export function IsPriorityAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPriorityAlreadyExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || { message: 'This priority is busy.' },
      validator: IsPriorityAlreadyExistConstraint,
    });
  };
}
