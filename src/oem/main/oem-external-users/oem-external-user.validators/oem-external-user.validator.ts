import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

import { OemExternalUserEntity } from '../oem-external-user.entity';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'isUserEnabled', async: true })
@Injectable()
@SetCurrentTenant
export class IsUserEnabled implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemExternalUserEntity)
    private readonly repo: Repository<OemExternalUserEntity>,
  ) {}

  async validate(userId: number): Promise<boolean> {
    try {
      const user = await this.repo.findOne({ externalUserId: userId });

      return !user;
    } catch (e) {
      throw new BadRequestException('Cannot validate replaced user');
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The external user is disabled';
  }
}
