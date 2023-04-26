import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ChannelDto } from './oem-channel.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ChannelUpdateDto extends OmitType(ChannelDto, [
  'channelId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'companyPrograms',
  'companyChannels',
]) {
  @IsOptional()
  name: string;

  @IsOptional()
  contactName: string;

  @IsOptional()
  contactEmail: string;
}

export { ChannelUpdateDto as OemChannelUpdateDto };
