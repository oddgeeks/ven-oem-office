import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OemCompanyProgram } from './oem-company-program.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemCompanyProgramsService extends TypeOrmCrudService<OemCompanyProgram> {
  constructor(
    @InjectRepository(OemCompanyProgram)
    public repo: Repository<OemCompanyProgram>,
  ) {
    super(repo);
  }
}
