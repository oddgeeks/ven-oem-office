import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemDiscountPriorities } from './oem-discount-priorities.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemDiscountPrioritiesService extends TypeOrmCrudService<OemDiscountPriorities> {
  constructor(@InjectRepository(OemDiscountPriorities) repo) {
    super(repo);
  }

  /**
   * Checks if there is record with given `params`, then disables it.
   * Otherwise rejects with `NotFoundException`.
   */
  async disableOne(params: {
    sourceId: number;
    targetId: number;
  }): Promise<OemDiscountPriorities> {
    const { sourceId, targetId } = params;

    const discountPriority = await this.repo.findOne({
      where: {
        sourceDiscountId: sourceId,
        targetDiscountId: targetId,
        isEnabled: true,
      },
    });

    if (!discountPriority) {
      throw new NotFoundException('OemQuotesCustomerProducts not found.');
    }

    discountPriority.isEnabled = false;

    return this.repo.save(discountPriority);
  }

  /*
  @RetroactivelyPriority()
  public async replaceOne(
    req: CrudRequest,
    dto: Partial<OemDiscountReplaceDto>,
  ): Promise<OemDiscountPriorities> {
    return await super.replaceOne(req, dto as any);
  }*/

  /*
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemQuoteReplaceDto>,
  ): Promise<OemQuoteEntity> {
    return this.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const quote = await this.repo.findOne(quoteId.value);

      if (quote) {
        return this.update(quoteId.value, dto, manager);
      }

      return super.replaceOne(req, dto);
    });
  }*/
}
