import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemVendosQuotes } from './oem-vendos-quotes.entity';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { CrudRequest } from '@nestjsx/crud';
import { OemVendosQuotesDto } from './oem-vendos-quotes.dto/oem-vendos-quotes.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
@Injectable()
@CommonDefaultMethodExtension
export class OemVendosQuotesService extends TypeOrmCrudService<OemVendosQuotes> {
  constructor(@InjectRepository(OemVendosQuotes) repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemVendosQuotesDto>,
  ): Promise<OemVendosQuotes> {
    return super.updateOne(req, dto);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.ATTACH)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemVendosQuotesDto>,
  ): Promise<OemVendosQuotes> {
    return super.replaceOne(req, dto);
  }
}
