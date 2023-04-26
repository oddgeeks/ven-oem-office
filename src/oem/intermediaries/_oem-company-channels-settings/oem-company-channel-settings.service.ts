import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OemCompanyChannelSetting } from './oem-company-channel-setting.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { CrudRequest } from '@nestjsx/crud';
import { CompanyChannelSettingCreateDto } from './oem-company-channel-setting.dto/oem-company-channel-setting.create.dto';

@Injectable()
@CommonDefaultMethodExtension
export class OemCompanyChannelSettingsService extends TypeOrmCrudService<OemCompanyChannelSetting> {
  constructor(
    @InjectRepository(OemCompanyChannelSetting)
    public repo: Repository<OemCompanyChannelSetting>,
  ) {
    super(repo);
  }

  async createOne(
    req: CrudRequest,
    dto: Partial<CompanyChannelSettingCreateDto>,
  ): Promise<OemCompanyChannelSetting> {
    return super.createOne(req, dto);
  }
}
