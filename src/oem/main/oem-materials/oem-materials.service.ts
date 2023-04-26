import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Repository } from 'typeorm';

import { Material, OemMaterialEntity } from './oem-material.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';

@Injectable()
@CommonDefaultMethodExtension
export class OemMaterialsService extends TypeOrmCrudService<OemMaterialEntity> {
  constructor(
    @InjectRepository(OemMaterialEntity)
    protected repo: Repository<OemMaterialEntity>,
  ) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.MATERIAL, ActionsEnum.CREATE)
  async createOne(...args: []): Promise<OemMaterialEntity> {
    return super.createOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.MATERIAL, ActionsEnum.UPDATE)
  async updateOne(...args: []): Promise<OemMaterialEntity> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.MATERIAL, ActionsEnum.UPDATE)
  async replaceOne(...args: []): Promise<OemMaterialEntity> {
    return super.replaceOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.MATERIAL, ActionsEnum.DELETE)
  async deleteOne(req: CrudRequest): Promise<void | Material> {
    const id = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    );

    const material = await this.repo.findOne(id.value);
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    material.isEnabled = false;
    return this.repo.save(material);
  }
}
