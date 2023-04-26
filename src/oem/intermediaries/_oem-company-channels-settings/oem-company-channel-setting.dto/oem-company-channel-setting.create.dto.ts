import { OmitType } from '@nestjs/swagger';
import { OemCompanyChannelSettingDto } from './oem-company-channel-setting.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyChannelSettingCreateDto extends OmitType(
  OemCompanyChannelSettingDto,
  [
    'companyChannelSettingId',
    'channel',
    'companyId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'companyChannel',
  ],
) {}

export { CompanyChannelSettingCreateDto as OemCompanyChannelSettingCreateDto };
