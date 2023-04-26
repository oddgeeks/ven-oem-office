import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { OemQuoteCompanyChannel } from './oem-quote-company-channel.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuoteCompanyChannelsService extends TypeOrmCrudService<OemQuoteCompanyChannel> {
  constructor(
    @InjectRepository(OemQuoteCompanyChannel)
    public repo: Repository<OemQuoteCompanyChannel>,
  ) {
    super(repo);
  }
}
