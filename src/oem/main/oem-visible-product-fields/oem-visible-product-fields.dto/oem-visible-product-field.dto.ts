import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsPositive,
  IsInt,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ListNameEnum } from '../oem-visible-product-fields.enums/list-name.enum';

export class VisibleProductFieldDto {
  /**
   * The id of Visible Product Fields
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  visibleProductFieldId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  companyId: number;

  /**
   * The custom name
   * @example Discount list price 1
   */
  @IsString()
  @IsOptional()
  @MaxLength(128)
  customName: string;

  /**
   * The list name
   * @example Gross Margin (%)
   */
  @IsNotEmpty()
  @IsEnum(ListNameEnum)
  listName: ListNameEnum;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of creating.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;
}

export { VisibleProductFieldDto as OemVisibleProductFieldDto };
