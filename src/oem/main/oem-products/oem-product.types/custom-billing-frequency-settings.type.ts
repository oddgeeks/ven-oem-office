import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { TermTypeEnum } from '../oem-product.enums/term-type.enum';

/**
 * we cannot use validator for interfaces - thats why we implement types
 * https://github.com/typestack/class-validator/issues/126
 */

export type PeriodType = {
  term: number;
  type: TermTypeEnum;
};

export class Period implements PeriodType {
  @IsNumber()
  @IsPositive()
  @IsInt()
  term: number;
  @IsEnum(TermTypeEnum)
  type: TermTypeEnum;
}

export type CustomBillingFrequencySettingsType = {
  period: PeriodType;
  frequency: number;
};

export class CustomBillingFrequencySettings
  implements CustomBillingFrequencySettingsType
{
  constructor(data: Partial<CustomBillingFrequencySettings> = {}) {
    Object.assign(this, data);
  }

  @IsNumber()
  @IsPositive()
  @IsInt()
  frequency: number;
  @Type(() => Period)
  period: Period;
}
