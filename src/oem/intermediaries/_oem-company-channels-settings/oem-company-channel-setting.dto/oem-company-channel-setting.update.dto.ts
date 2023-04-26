import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CompanyChannelSettingDto } from './oem-company-channel-setting.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyChannelSettingUpdateDto extends OmitType(
  CompanyChannelSettingDto,
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
) {
  @IsOptional()
  name: string;

  @IsOptional()
  contactName: string;

  @IsOptional()
  contactEmail: string;
}

export { CompanyChannelSettingUpdateDto as OemCompanyChannelSettingUpdateDto };
