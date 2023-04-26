import { PartialType } from '@nestjs/swagger';
import { OemCompanyProgramDto } from './oem-company-program.dto';
import { OemCompanyProgram } from '../oem-company-program.entity';

export class CompanyProgramSerializeDto extends PartialType(
  OemCompanyProgramDto,
) {
  constructor(data: Partial<OemCompanyProgram> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { CompanyProgramSerializeDto as OemCompanyProgramSerializeDto };
