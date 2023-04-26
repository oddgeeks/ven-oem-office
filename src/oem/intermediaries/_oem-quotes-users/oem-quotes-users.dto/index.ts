import { OemQuotesUsersCreateDto } from './oem-quotes-users.create.dto';
import { OemQuotesUsersUpdateDto } from './oem-quotes-users.update.dto';
import { OemQuotesUsersReplaceDto } from './oem-quotes-users.replace.dto';
import { OemQuotesUsersSerializeDto } from './oem-quotes-users.serialize.dto';

export const dto = {
  create: OemQuotesUsersCreateDto,
  update: OemQuotesUsersUpdateDto,
  replace: OemQuotesUsersReplaceDto,
};

export const serialize = {
  get: OemQuotesUsersSerializeDto,
  many: OemQuotesUsersSerializeDto,
};
