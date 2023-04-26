import { OmitType } from '@nestjs/swagger';
import { OemCompanyChannelDto } from './oem-company-channel.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyChannelCreateDto extends OmitType(OemCompanyChannelDto, [
  'companyChannelId',
  'companyChannelSettingId',
  'companyChannelSetting',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'geoHierarchy',
  'companyProgram',
  'licensingProgram',
  'users',
]) {}

export { CompanyChannelCreateDto as OemCompanyChannelCreateDto };
