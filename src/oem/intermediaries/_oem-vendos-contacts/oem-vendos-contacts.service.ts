import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemVendosContacts } from './oem-vendos-contacts.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemVendosContactsService extends TypeOrmCrudService<OemVendosContacts> {
  constructor(@InjectRepository(OemVendosContacts) repo) {
    super(repo);
  }
}
