import { ExternalUser } from '../oem-external-user.entity';
import { PartialType } from '@nestjs/swagger';
import { OemExternalUserDto } from './oem-external-user.dto';

export class OemExternalUserSerializeDto extends PartialType(
  OemExternalUserDto,
) {
  constructor(data: Partial<ExternalUser> = {}) {
    super();
    Object.assign(this, data);
  }
}
