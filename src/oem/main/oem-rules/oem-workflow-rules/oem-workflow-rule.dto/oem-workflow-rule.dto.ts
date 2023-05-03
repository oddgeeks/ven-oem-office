import {
  IsBoolean,
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { WorkflowRule } from '../oem-workflow-rule.entity';
import { Company } from '../../../oem-companies/oem-company.entity';
import { WorkflowRuleLogicType } from '../oem-workflow-rule.type/workflow-rule-logic.type';
import { OemUserEntity } from '../../../oem-users/oem-user.entity';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuantifiersEnum } from '../oem-workflow-rule.enums/quantifiers.enum';
import { PredicatesEnum } from '../oem-workflow-rule.enums/predicates.enum';
import { IsGeoHierarchy } from '../../../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';
import { IsWorkflowRuleLogicValid } from '../oem-workflow-rule.validators/workflow-rule-logic.validator';
import { IsWorkflowRuleExists } from '../oem-workflow-rule.validators/is-workflow-rule-exists.validator';

export class WorkflowRuleDto {
  constructor(data: Partial<WorkflowRule> = {}) {
    Object.assign(this, data);
  }

  /**
   * The id of WorkflowRule
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  workflowRuleId: number;

  /**
   * The id of Сompany
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
   * The workflow name
   * @example 'Workflow 1'
   */
  @MaxLength(256)
  @IsString()
  @Transform(({ value }) => {
    return String(value)?.trim();
  })
    //@Validate(IsWorkflowRuleExists)
  workflowRuleName: string;

  /**
   * The Workflow Logic
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
  //@Validate(IsWorkflowRuleLogicValid)
  @Type(() => WorkflowRuleLogicType)
  @IsNotEmpty()
  workflowRuleLogic: WorkflowRuleLogicType;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  isActive: boolean;

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
   * Is catchall
   * @example true
   */
  @IsBoolean()
  isCatchall: boolean;

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
  ownerUser: OemUserEntity;
}

export { WorkflowRuleDto as OemWorkflowRuleDto };
