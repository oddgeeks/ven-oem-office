import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';

import { OemProductEntity } from './oem-product.entity';
// import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';
import { OemProductCreateDto } from './oem-product.dto/oem-product.create.dto';
import { EventDispatcher } from '../../../common/decorators/event-dispatcher.decorator';
import { EventsEnum } from '../../../shared/event-handler/event.enum/events.enum';
import { OemProductUpdateDto } from './oem-product.dto/oem-product.update.dto';
import { SetDeleteMethod } from '../../../common/decorators/set-delete-method.decorator';
import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';
import { FixUpdateReplaceOne } from '../../../common/decorators/fix-replace-one.decorator';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@SetCloneMethod(['PriceTier'])
/*@SetCurrentTenant
@FixUpdateReplaceOne
@SetDeleteMethod*/
@CommonDefaultMethodExtension
export class OemProductsService extends TypeOrmCrudService<OemProductEntity> {
  constructor(
    @InjectRepository(OemProductEntity)
    public repo: Repository<OemProductEntity>,
  ) {
    super(repo);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED)
  async createOne(...args: []): Promise<OemProductEntity> {
    return super.createOne.call(this, ...args);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED)
  async updateOne(...args: []): Promise<OemProductEntity> {
    return super.updateOne.call(this, ...args);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED)
  async replaceOne(
    ...args: []
  ): Promise<OemProductEntity> {
    return super.replaceOne.call(this, ...args);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED, true)
  async deleteOne(...args: []): Promise<OemProductEntity> {
    return super.deleteOne.call(this, ...args);
  }
}
