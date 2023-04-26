import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChannelTypeEnum } from '../oem-company-channel.enums/channel-type.enum';
import { OemCompanyEntity } from '../../../main/oem-companies/oem-company.entity';
import { OemChannelEntity } from '../../../main/oem-channels/oem-channel.entity';
import { OemHierarchyEntity } from '../../../main/oem-hierarchies/oem-hierarchy.entity';
import { OemCompanyProgram } from '../../_oem-company-programs/oem-company-program.entity';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';
import { OemLicensingProgramEntity } from '../../../main/oem-licensing-programs/oem-licensing-program.entity';
import { Optional } from '@nestjs/common';
import { OemCompanyChannelSetting } from '../../_oem-company-channels-settings/oem-company-channel-setting.entity';

export class CompanyChannelDto {
  /**
   * The id of Company Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyChannelId: number;

  /**
   * The id of Company Channel Setting
   * @example 1
   */
  @IsNumber()
  @Optional()
  companyChannelSettingId?: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  /**
   * The id of Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  geoHierarchyId: number;

  /**
   * The id of Company Program
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyProgramId: number;

  /**
   * The channel type
   * @example Partner
   */
  @IsEnum(ChannelTypeEnum)
  @IsNotEmpty()
  channelType: ChannelTypeEnum;

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
  @Type(() => OemCompanyEntity)
  company: OemCompanyEntity;

  /*  /!**
   * The channel
   * @example Channel
   *!/
  @Type(() => OemChannelEntity)
  channel: OemChannelEntity;*/

  /**
   * The hierarchy
   * @example Hierarchy
   */
  @Type(() => OemHierarchyEntity)
  geoHierarchy: OemHierarchyEntity;

  /**
   * The company program
   * @example CompanyProgram
   */
  @Type(() => OemCompanyProgram)
  companyProgram: OemCompanyProgram;

  /**
   * The company program
   * @example CompanyChannelSetting
   */
  @IsOptional()
  @Type(() => OemCompanyChannelSetting)
  companyChannelSetting: OemCompanyChannelSetting;

  /**
   * The company licensing program
   * @example LicensingProgram
   */
  @Type(() => OemLicensingProgramEntity)
  licensingProgram: OemLicensingProgramEntity;

  /**
   * The users
   * @example []
   */
  @Type(() => OemUserEntity)
  @IsArray()
  users: OemUserEntity[];
}

export { CompanyChannelDto as OemCompanyChannelDto };
