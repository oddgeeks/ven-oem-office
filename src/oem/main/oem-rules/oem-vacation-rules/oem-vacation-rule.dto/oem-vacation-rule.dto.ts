import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  MaxLength, Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { VacationRule } from '../oem-vacation-rule.entity';
import { Company } from '../../../oem-companies/oem-company.entity';
import { User } from '../../../oem-users/oem-user.entity';
import { Different } from '../../../../../common/validators/different.validator';
import { IsVacationRuleExists } from '../oem-vacation-rule.validators/is-vacation-rule-exists.validator';

export class VacationRuleDto {
  constructor(data: Partial<VacationRule> = {}) {
    Object.assign(this, data);
  }

  /**
   * The id of VacationRule
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vacationRuleId: number;

  /**
   * The id of Сompany
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The vacation name
   * @example 'Vacation 1'
   */
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value)?.trim();
  })
  //TODO: should be or vacationName or branding type
  //super strange stuff, inject doesn't work correctly here!!! it inject another repo
  //@Validate(IsVacationRuleExists)
  name: string;

  /**
   * The id of Source User
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  sourceUserId: number;

  /**
   * The id of Target User
   * @example 2
   */
  @IsNumber()
  @IsNotEmpty()
  @Different('sourceUserId')
  targetUserId: number;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

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
   * @example CompanyEntity
   */
  @Type(() => Company)
  company: Company;

  /**
   * The source user
   * @example User
   */
  @Type(() => User)
  sourceUser: User;

  /**
   * The target user
   * @example User
   */
  @Type(() => User)
  targetUser: User;
}

export { VacationRuleDto as OemVacationRuleDto };
