import { OemLicensingProgramSerializeDto } from './oem-licensing-program.serialize.dto';
import { OemLicensingProgramCreateDto } from './oem-licensing-program.create.dto';
import { OemLicensingProgramReplaceDto } from './oem-licensing-program.replace.dto';
import { OemLicensingProgramUpdateDto } from './oem-licensing-program.update.dto';

export const dto = {
  create: OemLicensingProgramCreateDto,
  update: OemLicensingProgramUpdateDto,
  replace: OemLicensingProgramReplaceDto,
};

export const serialize = {
  get: OemLicensingProgramSerializeDto,
  getMany: OemLicensingProgramSerializeDto,
};
