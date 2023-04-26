import { OemQuoteAndVendoUuidSerializeDto } from './oem-quote-and-vendo-uuid.serialize.dto';
import { OemQuoteAndVendoUuidCreateDto } from './oem-quote-and-vendo-uuid.create.dto';
import { OemQuoteAndVendoUuidReplaceDto } from './oem-quote-and-vendo-uuid.replace.dto';
import { OemQuoteAndVendoUuidUpdateDto } from './oem-quote-and-vendo-uuid.update.dto';

export const dto = {
  create: OemQuoteAndVendoUuidCreateDto,
  update: OemQuoteAndVendoUuidUpdateDto,
  replace: OemQuoteAndVendoUuidReplaceDto,
};

export const serialize = {
  get: OemQuoteAndVendoUuidSerializeDto,
  many: OemQuoteAndVendoUuidSerializeDto,
};
