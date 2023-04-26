import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemDiscountEntity } from './oem-discount.entity';
import { CrudRequest } from '@nestjsx/crud';
import { RetroactivelyPriority } from './oem-discounts.decorators/retroactively-priority.decorator';
import { OemDiscountCreateDto } from './oem-discount.dto/oem-discount.create.dto';
import { OemDiscountPriorityDto } from './oem-discount.dto/oem-discount.priority.dto';
import { In } from 'typeorm';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { SetCloneMethod } from '../../../common/decorators/set-clone-method.decorator';

@Injectable()
@CommonDefaultMethodExtension
@SetCloneMethod(['DiscountRulesDiscounts'])
export class OemDiscountsService extends TypeOrmCrudService<OemDiscountEntity> {
  constructor(@InjectRepository(OemDiscountEntity) public repo) {
    super(repo);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT, ActionsEnum.CREATE)
  public async createOne(
    req: CrudRequest,
    dto: Partial<OemDiscountCreateDto>,
  ): Promise<OemDiscountEntity> {
    return await super.createOne(req, dto as any);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT, ActionsEnum.UPDATE)
  async updateOne(...args: []): Promise<OemDiscountEntity> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT, ActionsEnum.UPDATE)
  async replaceOne(...args: []): Promise<OemDiscountEntity> {
    return super.updateOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT, ActionsEnum.DELETE)
  async deleteOne(...args: []): Promise<OemDiscountEntity> {
    return super.deleteOne.call(this, ...args);
  }

  @ActionLogs(ActionLogTypeEnum.DISCOUNT, ActionsEnum.UPDATE)
  @RetroactivelyPriority()
  public async setRetroactivelyPriority(
    req: CrudRequest,
    dto: Partial<OemDiscountPriorityDto>,
  ): Promise<OemDiscountEntity[]> {
    const { sourceDiscountId, targetDiscountId } = dto;
    const sortDirection =
      sourceDiscountId - targetDiscountId < 0 ? 'ASC' : 'DESC';

    return this.repo.find({
      where: {
        discountId: In([sourceDiscountId, targetDiscountId]),
      },
      order: {
        discountId: sortDirection,
      },
    });
  }
}
