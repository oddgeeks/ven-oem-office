import { PartialType } from '@nestjs/swagger';
import { QuotesUsersDto } from './oem-quotes-users.dto';
import { QuotesUsers } from '../oem-quotes-users.entity';

export class QuotesUsersSerializeDto extends PartialType(QuotesUsersDto) {
  constructor(data: Partial<QuotesUsers> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { QuotesUsersSerializeDto as OemQuotesUsersSerializeDto };
