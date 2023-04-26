import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemQuotesMaterials } from './oem-quotes-materials.entity';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { CrudRequest } from '@nestjsx/crud';
import { OemQuotesMaterialsDto } from './oem-quotes-materials.dto/oem-quotes-materials.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { OemVendosMaterials } from '../_oem-vendos-materials/oem-vendos-materials.entity';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuotesMaterialsService extends TypeOrmCrudService<OemQuotesMaterials> {
  constructor(@InjectRepository(OemQuotesMaterials) repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemQuotesMaterialsDto>,
  ): Promise<OemQuotesMaterials> {
    return super.updateOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.ATTACH)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemQuotesMaterialsDto>,
  ): Promise<OemQuotesMaterials> {
    return super.replaceOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.DETACH)
  async deleteOne(...args: []): Promise<OemQuotesMaterials> {
    return super.deleteOne.call(this, ...args);
  }
}
