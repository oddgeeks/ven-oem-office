import { PartialType } from '@nestjs/swagger';
import { QuotesUsersDto } from './oem-quotes-users.dto';
import { QuotesExternalUsers } from '../oem-quotes-external-users.entity';

export class QuotesUsersSerializeDto extends PartialType(QuotesUsersDto) {
  constructor(data: Partial<QuotesExternalUsers> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { QuotesUsersSerializeDto as OemQuotesUsersSerializeDto };
