import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { OemCustomerAddresses } from './oem-customer-addresses.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemCustomerAddressesService extends TypeOrmCrudService<OemCustomerAddresses> {
  constructor(
    @InjectRepository(OemCustomerAddresses)
    public repo: Repository<OemCustomerAddresses>,
  ) {
    super(repo);
  }
}
