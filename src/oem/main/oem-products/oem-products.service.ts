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

@Injectable()
@SetCloneMethod(['PriceTier'])
@SetCurrentTenant
@FixUpdateReplaceOne
@SetDeleteMethod
// @CommonDefaultMethodExtension
export class OemProductsService extends TypeOrmCrudService<OemProductEntity> {
  constructor(
    @InjectRepository(OemProductEntity)
    public repo: Repository<OemProductEntity>,
  ) {
    super(repo);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED)
  async createOne(
    req: CrudRequest,
    dto: Partial<OemProductCreateDto>,
  ): Promise<OemProductEntity> {
    return super.createOne.call(this, req, dto);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemProductUpdateDto>,
  ): Promise<OemProductEntity> {
    return super.updateOne.call(this, req, dto);
  }

  @EventDispatcher<OemProductEntity>(EventsEnum.PRODUCT_CHANGED, true)
  async deleteOne(req: CrudRequest) {
    const productId = req.parsed.paramsFilter.find(
      (params) => params.field === req.options.params.id.field,
    )?.value;
    const product = await this.repo.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.manager.transaction(async (manager) => {
      return await manager.save(
        this.repo.create({
          ...product,
          isEnabled: false,
        }),
      );
    });
  }
}
