import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemProductsRelationships } from './oem-products-relationships.entity';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { CrudRequest } from '@nestjsx/crud';
import { ProductsRelationshipsDto } from './oem-products-relationships.dto/oem-products-relationships.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod()
export class OemProductsRelationshipsService extends TypeOrmCrudService<OemProductsRelationships> {
  constructor(@InjectRepository(OemProductsRelationships) repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.PRODUCT_RELATIONSHIPS, ActionsEnum.CREATE)
  public async createOne(
    req: CrudRequest,
    dto: Partial<ProductsRelationshipsDto>,
  ): Promise<OemProductsRelationships> {
    return super.createOne(req, dto as any);
  }

  @ActionLogs(ActionLogTypeEnum.PRODUCT_RELATIONSHIPS, ActionsEnum.UPDATE)
  async updateOne(...args: []): Promise<OemProductsRelationships> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.PRODUCT_RELATIONSHIPS, ActionsEnum.UPDATE)
  async replaceOne(...args: []): Promise<OemProductsRelationships> {
    return super.replaceOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.PRODUCT_RELATIONSHIPS, ActionsEnum.DELETE)
  async deleteOne(...args: []): Promise<OemProductsRelationships> {
    return super.deleteOne.call(this, ...args);
  }
}
