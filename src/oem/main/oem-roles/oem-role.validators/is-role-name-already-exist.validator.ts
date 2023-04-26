import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository, ILike } from 'typeorm';

import { OemRoleEntity } from '../oem-role.entity';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'IsRoleNameAlreadyExist', async: true })
@Injectable()
@SetCurrentTenant
export class IsRoleNameAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(OemRoleEntity)
    private readonly repo: Repository<OemRoleEntity>,
  ) {}

  async validate(
    roleName: string,
    args?: ValidationArguments,
  ): Promise<boolean> {
    try {
      const role = await this.repo.findOne({
        where: {
          roleName: ILike(roleName),
          isEnabled: true,
        },
      });

      return !role;
    } catch (err) {
      throw new BadRequestException('Cannot validate role');
    }
  }
}

export function IsRoleNameAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {
        message: 'Role name already exists. Please choose another name.',
      },
      validator: IsRoleNameAlreadyExistConstraint,
    });
  };
}
