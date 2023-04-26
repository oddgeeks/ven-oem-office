import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemAddressEntity } from './oem-address.entity';
import { Repository } from 'typeorm';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';

@Injectable()
@CommonDefaultMethodExtension
export class OemAddressesService extends TypeOrmCrudService<OemAddressEntity> {
  constructor(
    @InjectRepository(OemAddressEntity)
    public repo: Repository<OemAddressEntity>,
  ) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.ADDRESS, ActionsEnum.CREATE)
  async createOne(...args: []): Promise<OemAddressEntity> {
    return super.createOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.ADDRESS, ActionsEnum.UPDATE)
  async updateOne(...args: []): Promise<OemAddressEntity> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.ADDRESS, ActionsEnum.UPDATE)
  async replaceOne(...args: []): Promise<OemAddressEntity> {
    return super.replaceOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.ADDRESS, ActionsEnum.DELETE)
  async deleteOne(...args: []): Promise<OemAddressEntity> {
    return super.deleteOne.call(this, ...args);
  }
}
