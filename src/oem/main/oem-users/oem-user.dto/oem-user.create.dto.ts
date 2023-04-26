import { OmitType } from '@nestjs/swagger';
import { Validate } from 'class-validator';

import { OemUserDto } from './oem-user.dto';
import { User } from '../oem-user.entity';
import { IsUserEmailAlreadyExist } from '../oem-user.validators/oem-user.validator';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class UserCreateDto extends OmitType(OemUserDto, [
  'userId',
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'role',
  'companyChannel',
] as const) {
  constructor(data: Partial<User> = {}) {
    super();
    Object.assign(this, data);
  }

  @Validate(IsUserEmailAlreadyExist)
  ssoLoginEmail: string;
}

export { UserCreateDto as OemUserCreateDto };
