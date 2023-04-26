import { OmitType } from '@nestjs/swagger';
import { OemRoleDto } from './oem-role.dto';
import { IsOptional } from 'class-validator';
import { RoleTypeEnum } from '../oem-role.enums/role-type.enum';
import { DataAccessEnum } from '../oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../oem-role.enums/create-access.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class RoleUpdateDto extends OmitType(OemRoleDto, [
  'roleId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'companyId',
  'users',
  'approvalQueuePriority',
]) {
  @IsOptional()
  roleName: string;

  @IsOptional()
  roleType: RoleTypeEnum;

  @IsOptional()
  dataAccess: DataAccessEnum;

  @IsOptional()
  createAccess: CreateAccessEnum;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  isExportRight: boolean;
}

export { RoleUpdateDto as OemRoleUpdateDto };
