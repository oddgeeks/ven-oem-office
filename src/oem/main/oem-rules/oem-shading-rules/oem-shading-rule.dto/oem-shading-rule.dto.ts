import { OemCompanyEntity } from '../../../oem-companies/oem-company.entity';
import { OemUserEntity } from '../../../oem-users/oem-user.entity';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Max,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { ShadingRuleLogicType } from '../oem-shading-rule.type/shading-rule-logic.type';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsShadingRuleExists } from '../oem-shading-rule.validators/is-shading-rule-exists.validator';

export class ShadingRuleDto {
  /**
   * The id of Shading Rule
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  shadingRuleId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of the Owner
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  ownerUserId: number;

  /**
   * The priority of Shading Rule
   * @example 1
   */
  @IsNumber()
  @Min(0)
  @Max(999)
  priority: number;

  /**
   * The Shading Rule Name
   * @example "Hide 50"
   */
  @IsString()
  @MaxLength(256)
  @Transform(({ value }) => {
    return String(value)?.trim();
  })
  //@Validate(IsShadingRuleExists)
  shadingRuleName: string;

  /**
   * The Shading Rule Logic
   **/
  @ApiProperty({
    type: Object,
    example: {
      antecedent: [
        {
          type: 'AND',
          pre_quantifier: 'any single line item',
          predicate: 'contains',
          post_quantifier: 'the following products',
        },
        {
          type: 'AND',
          pre_quantifier: 'quantity',
          predicate: 'less than',
          post_quantifier: '10%',
        },
      ],
      consequent: [
        {
          type: 'AND',
          pre_quantifier: 'the entire quote',
          predicate: 'should',
          operation: 'shade red',
        },
      ],
    },
  })
  @Type(() => ShadingRuleLogicType)
  shadingRuleLogic: ShadingRuleLogicType;

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
  createdAt: Date | string;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The company
   * @example OemCompanyEntity
   */
  company: OemCompanyEntity;

  /**
   * The the Owner
   * @example OemUserEntity
   */
  ownerUser: OemUserEntity;
}

export { ShadingRuleDto as OemShadingRuleDto };
