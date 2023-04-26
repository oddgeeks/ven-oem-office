import { PartialType } from '@nestjs/swagger';
import { OemCompanyChannelDto } from './oem-company-channel.dto';
import { OemCompanyChannel } from '../oem-company-channel.entity';

export class CompanyChannelSerializeDto extends PartialType(
  OemCompanyChannelDto,
) {
  constructor(data: Partial<OemCompanyChannel> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { CompanyChannelSerializeDto as OemCompanyChannelSerializeDto };
