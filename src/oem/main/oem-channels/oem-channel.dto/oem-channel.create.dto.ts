import { OmitType } from '@nestjs/swagger';
import { OemChannelDto } from './oem-channel.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ChannelCreateDto extends OmitType(OemChannelDto, [
  'channelId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'companyPrograms',
  'companyChannels',
]) {}

export { ChannelCreateDto as OemChannelCreateDto };
