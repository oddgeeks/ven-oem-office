import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemCompanyAddressesEntity } from './oem-company-addresses.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { OemMaterialEntity } from '../../main/oem-materials/oem-material.entity';

@Injectable()
@CommonDefaultMethodExtension
export class OemCompanyAddressesService extends TypeOrmCrudService<OemCompanyAddressesEntity> {
  constructor(@InjectRepository(OemCompanyAddressesEntity) repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY, ActionsEnum.ATTACH)
  async updateOne(...args: []): Promise<OemCompanyAddressesEntity> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY, ActionsEnum.ATTACH)
  async replaceOne(...args: []): Promise<OemCompanyAddressesEntity> {
    return super.replaceOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY, ActionsEnum.DETACH)
  async deleteOne(...args: []): Promise<OemCompanyAddressesEntity> {
    return super.deleteOne.call(this, ...args);
  }
}
