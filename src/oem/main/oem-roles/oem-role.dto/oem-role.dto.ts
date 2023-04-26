import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsEnum,
  IsBoolean,
  IsDate,
  IsOptional,
  IsInt,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

import { RoleTypeEnum } from '../oem-role.enums/role-type.enum';
import { DataAccessEnum } from '../oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../oem-role.enums/create-access.enum';
import { FunctionTypeEnum } from '../oem-role.enums/function-type.enum';
import { OemCompanyEntity } from '../../oem-companies/oem-company.entity';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { IsPriorityAlreadyExist } from '../oem-role.validators/is-priority-already-exist.validator';
import { IsRoleNameAlreadyExist } from '../oem-role.validators/is-role-name-already-exist.validator';
import { ApprovalQueuePriority } from '../../oem-approval-queue-priorities/oem-approval-queue-priority.entity';

export class RoleDto {
  /**
   * The id of Role
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The name of Role
   * @example Admin
   */
  @IsString()
  @MaxLength(128)
  @IsRoleNameAlreadyExist()
  roleName: string;

  /**
   * The priority of Role
   * @example 1
   */
  @IsPositive()
  @IsInt()
  @Min(0)
  @Max(999)
  @IsPriorityAlreadyExist()
  @IsOptional()
  priority: number;

  /**
   * The role type
   * @example Quote Creator
   */
  @IsEnum(RoleTypeEnum)
  @IsNotEmpty()
  roleType: RoleTypeEnum;

  /**
   * The data access permissions
   * @example Team & Sub-Hierarchy
   */
  @IsEnum(DataAccessEnum)
  @IsNotEmpty()
  dataAccess: DataAccessEnum;

  /**
   * The create access permissions
   * @example Edit & Approve Only
   */
  @IsEnum(CreateAccessEnum)
  @IsNotEmpty()
  createAccess: CreateAccessEnum;

  /**
   * Is role active
   * @example true
   */
  @IsBoolean()
  isActive: boolean;

  /**
   * Is there export rights
   * @example true
   */
  @IsBoolean()
  isExportRight: boolean;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The function type
   * @example Admin
   */
  @IsEnum(FunctionTypeEnum)
  @IsOptional()
  functionType: FunctionTypeEnum;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The company of Role
   * @example Company
   */
  company: OemCompanyEntity;

  /**
   * The users of Role
   * @example Users[]
   */
  users: OemUserEntity[];

  /**
   * The approval queue priority
   * @example ApprovalQueuePriority
   */
  approvalQueuePriority: ApprovalQueuePriority;
}

export { RoleDto as OemRoleDto };
