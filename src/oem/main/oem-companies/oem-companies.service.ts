import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemCompanyEntity } from './oem-company.entity';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { Repository } from 'typeorm';
import { OemQuoteAndVendoUuidsService } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.service';
import { UuidTypesEnum } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo.enums/uuid-types.enum';
import { CrudRequest } from '@nestjsx/crud';
import { OemCompanyCreateDto } from './oem-company.dto/oem-company.create.dto';
import { OemCompanyUpdateDto } from './oem-company.dto/oem-company.update.dto';
import { OemCompanyReplaceDto } from './oem-company.dto/oem-company.replace.dto';
import { OemCompanyDto } from './oem-company.dto/oem-company.dto';

@Injectable()
@CommonDefaultMethodExtension
export class OemCompaniesService extends TypeOrmCrudService<OemCompanyEntity> {
  constructor(
    @InjectRepository(OemCompanyEntity)
    public repo: Repository<OemCompanyEntity>,
    private quoteAndVendoUuidsService: OemQuoteAndVendoUuidsService,
  ) {
    super(repo);
  }

  /**
   * Updates starting quote/vendo numbers
   * @param dto
   * @private
   * return Promise<void>
   */
  // TODO: we really have to wrap with transaction otherwise race condition will happen here
  private async _updateQuoteVendoUUID(
    dto: Partial<OemCompanyDto>,
  ): Promise<void> {
    if (dto?.settings?.startingQuoteNumber) {
      const startingQuoteNumber =
        Number(dto?.settings?.startingQuoteNumber) === 0
          ? Math.abs(Number(dto?.settings?.startingQuoteNumber))
          : Math.abs(Number(dto?.settings?.startingQuoteNumber) - 1);
      //update QUOTE UUID
      await this.quoteAndVendoUuidsService.updateUuid(UuidTypesEnum.QUOTE, {
        lastUuid: startingQuoteNumber,
      });
      //update VENDO UUID
      await this.quoteAndVendoUuidsService.updateUuid(UuidTypesEnum.VENDO, {
        lastUuid: startingQuoteNumber,
      });
    }
  }

  /*public async getCompanySettings(): Promise<OemCompanyEntity>{

  }*/

  @ActionLogs(ActionLogTypeEnum.COMPANY, ActionsEnum.CREATE)
  async createOne(
    req: CrudRequest,
    dto: Partial<OemCompanyCreateDto>,
  ): Promise<OemCompanyEntity> {
    const res = super.createOne.call(this, req, dto);
    await this._updateQuoteVendoUUID({ ...res, ...dto });
    return res;
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemCompanyUpdateDto>,
  ): Promise<OemCompanyEntity> {
    const res = super.updateOne.call(this, req, dto);
    await this._updateQuoteVendoUUID({ ...res, ...dto });
    return res;
  }

  @ActionLogs(ActionLogTypeEnum.COMPANY, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemCompanyReplaceDto>,
  ): Promise<OemCompanyEntity> {
    const res = super.replaceOne.call(this, req, dto);
    await this._updateQuoteVendoUUID({ ...res, ...dto });
    return res;
  }
}
