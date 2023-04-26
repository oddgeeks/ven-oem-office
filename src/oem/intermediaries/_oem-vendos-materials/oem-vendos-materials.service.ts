import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemVendosMaterials } from './oem-vendos-materials.entity';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { CrudRequest } from '@nestjsx/crud';
import { OemVendosMaterialsDto } from './oem-vendos-materias.dto/oem-vendos-materials.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { OemMaterialEntity } from '../../main/oem-materials/oem-material.entity';

@Injectable()
@CommonDefaultMethodExtension
export class OemVendosMaterialsService extends TypeOrmCrudService<OemVendosMaterials> {
  constructor(@InjectRepository(OemVendosMaterials) repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemVendosMaterialsDto>,
  ): Promise<OemVendosMaterials> {
    return super.updateOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.ATTACH)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemVendosMaterialsDto>,
  ): Promise<OemVendosMaterials> {
    return super.replaceOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.DETACH)
  async deleteOne(...args: []): Promise<OemVendosMaterials> {
    return super.deleteOne.call(this, ...args);
  }
}
