import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemQuotesContacts } from './oem-quotes-contacts.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuotesContactsService extends TypeOrmCrudService<OemQuotesContacts> {
  constructor(@InjectRepository(OemQuotesContacts) repo) {
    super(repo);
  }
}
