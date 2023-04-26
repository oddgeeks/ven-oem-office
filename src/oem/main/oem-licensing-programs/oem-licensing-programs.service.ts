import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemLicensingProgramEntity } from './oem-licensing-program.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemLicensingProgramsService extends TypeOrmCrudService<OemLicensingProgramEntity> {
  constructor(@InjectRepository(OemLicensingProgramEntity) public repo) {
    super(repo);
  }
}
