import { OemCompanyProgramSerializeDto } from './oem-company-program.serialize.dto';
import { OemCompanyProgramCreateDto } from './oem-company-program.create.dto';
import { OemCompanyProgramReplaceDto } from './oem-company-program.replace.dto';
import { OemCompanyProgramUpdateDto } from './oem-company-program.update.dto';

export const dto = {
  update: OemCompanyProgramUpdateDto,
  replace: OemCompanyProgramReplaceDto,
  create: OemCompanyProgramCreateDto,
};

export const serialize = {
  get: OemCompanyProgramSerializeDto,
  many: OemCompanyProgramSerializeDto,
};
