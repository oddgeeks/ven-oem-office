import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

import { OemQuotesProducts } from './oem-quotes-products.entity';
import { OemQuotesProductsCreateDto } from './oem-quotes-products.dto/oem-quotes-products.create.dto';
import { OemQuotesProductsUpdateDto } from './oem-quotes-products.dto/oem-quotes-products.update.dto';
import { OemProductsService } from '../../main/oem-products/oem-products.service';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { EventDispatcher } from '../../../common/decorators/event-dispatcher.decorator';
// import { OemQuoteEventsEnum } from '../../../../oem/main/oem-quotes/oem-quote.events/oem-quote.events.enum';
import { EventsEnum } from '../../../shared/event-handler/event.enum/events.enum';
import { OemQuotesProductsReplaceDto } from './oem-quotes-products.dto/oem-quotes-products.replace.dto';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuotesProductsService extends TypeOrmCrudService<OemQuotesProducts> {
  constructor(
    @InjectRepository(OemQuotesProducts)
    public repo: Repository<OemQuotesProducts>,
    @Inject(OemProductsService) private productsService: OemProductsService,
  ) {
    super(repo);
  }

  @EventDispatcher<OemQuotesProducts>(EventsEnum.QUOTE_PRODUCT_CHANGED)
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.ATTACH)
  async createOne(
    req: CrudRequest,
    dto: Partial<OemQuotesProductsCreateDto>,
  ): Promise<OemQuotesProducts> {
    return await this.repo.manager.transaction(async (manager) => {
      const product = await this.productsService.repo.findOne(dto.productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const endDate = moment
        .utc(new Date(dto.startDate))
        .add(product.term, product.termType)
        .toDate();

      return super.createOne(req, {
        ...dto,
        endDate,
      });
    });
  }

  @EventDispatcher<OemQuotesProducts>(EventsEnum.QUOTE_PRODUCT_CHANGED)
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemQuotesProductsUpdateDto>,
  ): Promise<OemQuotesProducts> {
    return await this.repo.manager.transaction(async (manager) => {
      if (!dto.startDate) return super.updateOne(req, dto);

      const quoteProductId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const quoteProduct = await this.repo.findOne({
        where: {
          quoteProductId: quoteProductId.value,
        },
        relations: ['product'],
      });

      dto.quoteId = quoteProduct.quoteId;

      if (!quoteProduct) throw new NotFoundException('Quote Product not found');

      if (!dto.startDate) return super.updateOne(req, dto);

      const endDate = moment
        .utc(new Date(dto.startDate))
        .add(quoteProduct.product.term, quoteProduct.product.termType)
        .toDate();

      return super.updateOne(req, {
        ...dto,
        endDate,
      });
    });
  }

  @EventDispatcher<OemQuotesProducts>(EventsEnum.QUOTE_PRODUCT_CHANGED)
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemQuotesProductsReplaceDto>,
  ): Promise<OemQuotesProducts> {
    return await this.repo.manager.transaction(async (manager) => {
      const quoteProductId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const quoteProduct = await this.repo.findOne({
        where: { quoteProductId: quoteProductId.value, enabled: true },
      });

      if (!quoteProduct) throw new NotFoundException('Quote Product not found');

      dto.quoteId = quoteProduct.quoteId;

      return super.updateOne(req, {
        ...dto,
      });
    });
  }
}
