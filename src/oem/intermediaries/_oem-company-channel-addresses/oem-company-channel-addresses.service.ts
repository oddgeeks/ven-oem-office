import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { OemCompanyChannelAddresses } from './oem-company-channel-addresses.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemCompanyChannelAddressesService extends TypeOrmCrudService<OemCompanyChannelAddresses> {
  constructor(
    @InjectRepository(OemCompanyChannelAddresses)
    public repo: Repository<OemCompanyChannelAddresses>,
  ) {
    super(repo);
  }
}
