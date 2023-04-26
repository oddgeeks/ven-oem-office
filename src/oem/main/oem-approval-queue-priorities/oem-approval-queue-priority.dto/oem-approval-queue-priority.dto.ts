import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsPositive,
  Max,
  IsBoolean,
  IsDate,
  Min,
  IsOptional,
} from 'class-validator';

import { OemCompanyEntity } from '../../oem-companies/oem-company.entity';
import { OemRoleEntity } from '../../oem-roles/oem-role.entity';

export class ApprovalQueuePriorityDto {
  /**
   * The id of Approval Queue Priority
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  approvalQueuePriorityId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Role
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  /**
   * The priority of Role
   * @example 1
   */
  @IsPositive()
  @IsInt()
  @Min(0)
  @Max(999)
  @IsOptional()
  priority?: number;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isEnabled: boolean;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date;

  /**
   * The company
   * @example Company
   */
  company: OemCompanyEntity;

  /**
   * The role
   * @example Role
   */
  role: OemRoleEntity;
}

export { ApprovalQueuePriorityDto as OemApprovalQueuePriorityDto };
