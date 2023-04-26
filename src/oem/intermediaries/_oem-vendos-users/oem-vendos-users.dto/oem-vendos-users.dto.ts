import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';

import { OemVendoEntity } from '../../../main/oem-vendos/oem-vendo.entity';
import { VendoStatusEnum } from '../../../main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';

export class VendosUsersDto {
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
  @IsNotEmpty()
  userId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * Is owner
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isOwner: boolean;

  /**
   * Is approver
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isApprover: boolean;

  /**
   * The approval status for saved alert
   * @example Pending
   */
  @IsEnum(VendoStatusEnum)
  @IsOptional()
  approvalStatus: VendoStatusEnum;

  /**
   * Is saved alert user
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isSavedAlertUser: boolean;

  /**
   * Is workflow user
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  isWorkflowUser: boolean;

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
   * The vendo
   * @example Vendo
   */
  vendo: OemVendoEntity;

  /**
   * The user
   * @example User
   */
  user: OemUserEntity;
}

export { VendosUsersDto as OemVendosUsersDto };
