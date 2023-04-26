import { Company } from '../../oem-companies/oem-company.entity';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LicensingProgramTypeEnum } from '../oem-licensing-program.enums/licensing-program-type.enum';
import { OemCompanyChannel } from '../../../intermediaries/_oem-company-channels/oem-company-channel.entity';

export class LicensingProgramDto {
  /**
   * The id of Licensing Program
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  licensingProgramId: number;

  /**
   * The type of Licensing Program
   * @example Customer
   */
  @IsNotEmpty()
  @IsEnum(LicensingProgramTypeEnum)
  licensingProgramType: LicensingProgramTypeEnum;

  /**
   * The name of Licensing Program
   * @example Customer-12
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  licensingProgramName: string;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The discount
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of updating hierarchy.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating hierarchy.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The company
   * @example Company
   */
  @Type(() => Company)
  company: Company;

  /**
   * The company channel
   * @example CompanyChannel
   */
  @Type(() => OemCompanyChannel)
  companyChannel: OemCompanyChannel;
}

export { LicensingProgramDto as OemLicensingProgramDto };
