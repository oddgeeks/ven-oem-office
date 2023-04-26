import { OemQuoteUpdateDto } from './oem-quote.update.dto';
import { OemQuoteReplaceDto } from './oem-quote.replace.dto';
import { OemQuoteSerializeDto } from './oem-quote.serialize.dto';
import { OemQuoteCreateDto } from './oem-quote.create.dto';

export const dto = {
  update: OemQuoteUpdateDto,
  replace: OemQuoteReplaceDto,
  create: OemQuoteCreateDto,
};

export const serialize = {
  get: OemQuoteSerializeDto,
  many: OemQuoteSerializeDto,
};
