import { OmitType } from '@nestjs/swagger';

import { OemCompanyChannelDto } from './oem-company-channel.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyChannelReplaceDto extends OmitType(OemCompanyChannelDto, [
  'companyChannelId',
  'companyChannelSettingId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'channelId',
  'geoHierarchy',
  'companyProgram',
  'licensingProgram',
  'users',
]) {}

export { CompanyChannelReplaceDto as OemCompanyChannelReplaceDto };
