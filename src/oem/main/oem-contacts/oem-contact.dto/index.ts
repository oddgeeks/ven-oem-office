import { OemContactCreateDto } from './oem-contact.create.dto';
import { OemContactUpdateDto } from './oem-contact.update.dto';
import { OemContactReplaceDto } from './oem-contact.replace.dto';
import { OemContactSerializeDto } from './oem-contact.serialize.dto';

export const dto = {
  create: OemContactCreateDto,
  update: OemContactUpdateDto,
  replace: OemContactReplaceDto,
};

export const serialize = {
  get: OemContactSerializeDto,
  getMany: OemContactSerializeDto,
};
