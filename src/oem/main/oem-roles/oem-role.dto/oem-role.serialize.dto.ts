import { PartialType } from '@nestjs/swagger';
import { OemRoleDto } from './oem-role.dto';
import { OemRoleEntity } from '../oem-role.entity';

export class RoleSerializeDto extends PartialType(OemRoleDto) {
  constructor(data: Partial<OemRoleEntity> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { RoleSerializeDto as OemRoleSerializeDto };
