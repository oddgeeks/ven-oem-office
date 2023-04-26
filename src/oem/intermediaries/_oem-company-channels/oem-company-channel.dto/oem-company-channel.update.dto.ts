import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { OemCompanyChannelDto } from './oem-company-channel.dto';
import { ChannelTypeEnum } from '../oem-company-channel.enums/channel-type.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyChannelUpdateDto extends OmitType(OemCompanyChannelDto, [
  'companyChannelId',
  'companyId',
  'companyProgramId',
  'companyChannelSettingId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'channelId',
  'geoHierarchy',
  'companyProgram',
  'licensingProgram',
  'users',
]) {
  @IsOptional()
  channelId: number;

  @IsOptional()
  geoHierarchyId: number;

  @IsOptional()
  channelType: ChannelTypeEnum;

  @IsOptional()
  isActive: boolean;
}

export { CompanyChannelUpdateDto as OemCompanyChannelUpdateDto };
