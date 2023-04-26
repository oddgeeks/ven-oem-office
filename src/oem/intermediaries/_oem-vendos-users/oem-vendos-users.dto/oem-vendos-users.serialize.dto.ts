import { PartialType } from '@nestjs/swagger';
import { VendosUsersDto } from './oem-vendos-users.dto';
import { VendosUsers } from '../oem-vendos-users.entity';

export class VendosUsersSerializeDto extends PartialType(VendosUsersDto) {
  constructor(data: Partial<VendosUsers> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { VendosUsersSerializeDto as OemVendosUsersSerializeDto };
