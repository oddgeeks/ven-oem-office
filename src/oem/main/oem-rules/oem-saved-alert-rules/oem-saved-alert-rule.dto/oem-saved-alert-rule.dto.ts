import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  IsOptional, Validate,
} from 'class-validator';
import { OemSavedAlertRule } from '../oem-saved-alert-rule.entity';
import { Company } from '../../../oem-companies/oem-company.entity';
import { SavedAlertRuleLogicType } from '../oem-saved-alert-rule.type/saved-alert-rule-logic.type';
import { OemUserEntity } from '../../../oem-users/oem-user.entity';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsSavedAlertRuleExists } from '../oem-saved-alert-rule.validators/is-saved-alert-rule-exists.validator';

export class SavedAlertRuleDto {
  constructor(data: Partial<OemSavedAlertRule> = {}) {
    Object.assign(this, data);
  }

  /**
   * The id of SavedAlertRule
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  savedAlertRuleId: number;

  /**
   * The id of Сompany
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of the User
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  /**
   * The rule name
   * @example 'Save Alert 1'
   */
  @MaxLength(256)
  @IsString()
  @Transform(({ value }) => {
    return String(value)?.trim();
  })
    //TODO: should be saved-alert-rule or branding type
  //@Validate(IsSavedAlertRuleExists)
  name: string;

  /**
   * The Rule Logic
   */
  @ApiProperty({
    type: Object,
    default: {
      antecedent: [
        {
          unit: null,
          scope: 'the-following-transaction-attributes',
          value: ['Net New', 'Expansion', 'Renewal'],
          valueTo: null,
          matchRule: 'contains',
          scopeCriteria: 'an-entire-quote',
          connectionType: 'then',
          operationCriteria: null,
        },
      ],
      consequent: [
        {
          value: 'approval emails',
          matchRule: 'should',
          scopeCriteria: [1, 3, 5, 7, 9],
          operationCriteria: 'be routed to',
        },
      ],
    },
  })
  //@Validate(IsSavedAlertRuleLogicValid)
  //@Type(() => SavedAlertRuleLogicType)
  @IsNotEmpty()
  @IsObject()
  ruleLogic: SavedAlertRuleLogicType;

  /**
   * The starting date of the rule for filtering
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  startDate: Date | string;

  /**
   * The ending date of the rule for filtering
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  endDate: Date | string;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  /**
   * Is catchall
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isCatchAll: boolean;

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
   * @example OemCompanyEntity
   */
  @Type(() => Company)
  company: Company;

  /**
   * The user
   * @example User
   */
  @Type(() => OemUserEntity)
  user: OemUserEntity;
}

export { SavedAlertRuleDto as OemSavedAlertRuleDto };
