import { OemQuoteCompanyChannelCreateDto } from './oem-quote-company-channel.create.dto';
import { OemQuoteCompanyChannelUpdateDto } from './oem-quote-company-channel.update.dto';
import { OemQuoteCompanyChannelReplaceDto } from './oem-quote-company-channel.replace.dto';
import { OemQuoteCompanyChannelSerializelDto } from './oem-quote-company-channel.serialize.dto';

export const dto = {
  create: OemQuoteCompanyChannelCreateDto,
  update: OemQuoteCompanyChannelUpdateDto,
  replace: OemQuoteCompanyChannelReplaceDto,
};

export const serialize = {
  get: OemQuoteCompanyChannelSerializelDto,
  many: OemQuoteCompanyChannelSerializelDto,
};
