import { OemCompanyUpdateDto } from './oem-company.update.dto';
import { OemCompanyReplaceDto } from './oem-company.replace.dto';
import { OemCompanySerializeDto } from './oem-company.serialize.dto';
import { OemCompanyCreateDto } from './oem-company.create.dto';

export const dto = {
  update: OemCompanyUpdateDto,
  replace: OemCompanyReplaceDto,
  create: OemCompanyCreateDto,
};
// eslint-disable-next-line @typescript-eslint/prefer-as-const
const FALSE: false = false;

export const serialize = {
  get: OemCompanySerializeDto,
  getMany: OemCompanySerializeDto,
};
