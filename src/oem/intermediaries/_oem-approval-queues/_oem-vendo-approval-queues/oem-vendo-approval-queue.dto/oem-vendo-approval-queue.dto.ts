import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Exclude } from 'class-transformer';

import { VendoApprovalQueueStatusEnum } from '../oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { VendoApprovalQueueTargetTypeEnum } from '../oem-vendo-approval-queue.enums/vendo-approval-queue-target-type.enum';
import { OemCompanyEntity } from '../../../../main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../../../../main/oem-users/oem-user.entity';
import { OemVendoEntity } from '../../../../main/oem-vendos/oem-vendo.entity';
import { OemApprovalQueuePriority } from '../../../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';

export class VendoApprovalQueueDto {
  /**
   * The id of Vendo Approval Queue
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vendoApprovalQueueId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Vendo
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vendoId: number;

  /**
   * The id of User
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  userId: number;

  /**
   * The id of Approval Queue Priority
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  approvalQueuePriorityId: number;

  /**
   * The token
   * @example token_string
   */
  @IsString()
  @Exclude()
  token: string;

  /**
   * The status
   * @example Approved
   */
  @IsEnum(VendoApprovalQueueStatusEnum)
  @IsOptional()
  status: VendoApprovalQueueStatusEnum;

  /**
   * The target type
   * @example User
   */
  @IsEnum(VendoApprovalQueueTargetTypeEnum)
  @IsOptional()
  targetType: VendoApprovalQueueTargetTypeEnum;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  /**
   * The date of token expiration.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  expiresAt: Date | string;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
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
   * The user
   * @example User
   */
  user: OemUserEntity;

  /**
   * The vendo
   * @example Vendo
   */
  vendo: OemVendoEntity;

  /**
   * The approval queue priority
   * @example ApprovalQueuePriority
   */
  approvalQueuePriority: OemApprovalQueuePriority;
}

export { VendoApprovalQueueDto as OemVendoApprovalQueueDto };
