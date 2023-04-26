import { PartialType } from '@nestjs/swagger';
import { OemChannelDto } from './oem-channel.dto';
import { OemChannelEntity } from '../oem-channel.entity';

export class ChannelSerializeDto extends PartialType(OemChannelDto) {
  constructor(data: Partial<OemChannelEntity> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { ChannelSerializeDto as OemChannelSerializeDto };
