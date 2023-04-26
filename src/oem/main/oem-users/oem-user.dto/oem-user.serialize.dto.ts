import { OemUserDto } from './oem-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../oem-user.entity';
import { Exclude } from 'class-transformer';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class UserSerializeDto extends OmitType(OemUserDto, ['password']) {
  constructor(data: Partial<User> = {}) {
    super();
    Object.assign(this, data);
  }

  @Exclude()
  password: string;
}

export { UserSerializeDto as OemUserSerializeDto };
