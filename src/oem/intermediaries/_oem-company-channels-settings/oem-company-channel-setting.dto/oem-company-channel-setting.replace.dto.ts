import { OmitType } from '@nestjs/swagger';

import { OemCompanyChannelSettingDto } from './oem-company-channel-setting.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyChannelSettingReplaceDto extends OmitType(
  OemCompanyChannelSettingDto,
  [
    'companyChannelSettingId',
    'companyId',
    'channelId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'companyChannel',
    'channel',
  ],
) {}

export { CompanyChannelSettingReplaceDto as OemCompanyChannelSettingReplaceDto };
