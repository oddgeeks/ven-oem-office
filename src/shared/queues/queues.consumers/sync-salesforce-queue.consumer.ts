import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

import { InjectRepository } from '@nestjs/typeorm';
import { JobNames, QueueNames } from '../queues.enums/queue-enum';
import { OemQuoteEntity } from '../../../oem/main/oem-quotes/oem-quote.entity';
import { SalesforceService } from '../../../shared/salesforce/salesforce.service';
import { OemProductEntity } from '../../../oem/main/oem-products/oem-product.entity';
import { OemQuotesContacts } from '../../../oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import { OemCustomersProducts } from '../../../oem/intermediaries/_oem-customers-products/oem-customers-products.entity';
import * as SFFieldMappingUtil from '../../salesforce/salesforce.utils/field-mapping.salesforce.util';

@Processor(QueueNames.SyncSalesForce)
export class SyncSalesForceQueueConsumer {
  private readonly logger = new Logger(SyncSalesForceQueueConsumer.name);

  constructor(
    // Need a transformer/integration module to separate the logic. @saleforce_sync
    // We should not call any of these repos - only the integration module. @saleforce_sync
    // An integration module with everything in one place allows you make changes without refactoring the module. @saleforce_sync
    // The integration module should include transformer + imported Salesforce service @saleforce_sync
    @InjectRepository(OemQuoteEntity)
    private readonly quoteRepo: Repository<OemQuoteEntity>,
    @InjectRepository(OemProductEntity)
    private readonly productRepo: Repository<OemProductEntity>,
    @InjectRepository(OemQuotesContacts)
    private readonly quoteContactRepo: Repository<OemQuotesContacts>,
    @InjectRepository(OemCustomersProducts)
    private readonly customerProductRepo: Repository<OemCustomersProducts>,
    private salesforceService: SalesforceService,
  ) {}

  @Process(JobNames.BatchSyncQuotesToSF)
  async batchSyncQuotes(job: Job) {
    await job.progress(0);

    const compareTime = moment.utc().subtract(1, 'days').toDate();
    this.logger.log(`compareTime is ${compareTime}`);

    try {
      const quotesToSync = await this.quoteRepo
        .createQueryBuilder('quotes')
        .where('quotes.updatedAt > :compareTime', { compareTime: compareTime })
        .leftJoinAndSelect('quotes.ownerUser', 'user')
        .leftJoinAndSelect('quotes.customer', 'customer')
        .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
        .leftJoinAndSelect('customerAddresses.address', 'address')
        .leftJoinAndSelect('quotes.quotesProducts', 'quotesProducts')
        .leftJoinAndSelect('quotesProducts.product', 'product')
        .leftJoinAndSelect('product.pricingModel', 'pricingModel')
        .getMany();

      const quotesContacts = await this.quoteContactRepo
        .createQueryBuilder('quotesContacts')
        .where('quotesContacts.updatedAt > :compareTime', {
          compareTime: compareTime,
        })
        .leftJoinAndSelect('quotesContacts.quote', 'quote')
        .leftJoinAndSelect('quotesContacts.contact', 'contact')
        .getMany();
      await this.salesforceService.batchSyncQuote(quotesToSync);
      await this.salesforceService.batchSyncQuoteContact(quotesContacts);
      await job.progress(100);
    } catch (error) {
      this.logger.error({
        func: `${JobNames.BatchSyncQuotesToSF}/process`,
        error,
      });

      throw error;
    }
  }
  @Process(JobNames.RealTimeSyncQuoteToSF)
  async realTimeSyncQuote(job: Job) {
    await job.progress(0);

    try {
      const quote = await this.quoteRepo
        .createQueryBuilder('quotes')
        .where('quotes.quoteId = :quoteId', { quoteId: job.data.id })
        .leftJoinAndSelect('quotes.ownerUser', 'user')
        .leftJoinAndSelect('quotes.customer', 'customer')
        .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
        .leftJoinAndSelect('customerAddresses.address', 'address')
        .leftJoinAndSelect('quotes.quotesProducts', 'quotesProducts')
        .leftJoinAndSelect('quotesProducts.product', 'product')
        .leftJoinAndSelect('product.pricingModel', 'pricingModel')
        .getOne();
      // TODO
      // Call transformer service to transform vendori quote to SF data before calling SF service.
      if (quote.isPrimary) {
        await this.salesforceService.realTimeSyncQuote(quote);
      }
      await job.progress(100);
    } catch (error) {
      this.logger.error({
        func: `${JobNames.RealTimeSyncQuoteToSF}/process`,
        error,
      });

      throw error;
    }
  }

  @Process(JobNames.CreateAssetToSF)
  async createAssetToSF(job: Job) {
    await job.progress(0);

    try {
      const quote = await this.quoteRepo
        .createQueryBuilder('quotes')
        .where('quotes.quoteId = :quoteId', { quoteId: job.data.id })
        .leftJoinAndSelect('quotes.customer', 'customer')
        .leftJoinAndSelect('quotes.quotesProducts', 'quotesProducts')
        .leftJoinAndSelect('quotesProducts.product', 'product')
        .leftJoinAndSelect('product.pricingModel', 'pricingModel')
        .getOne();
      const assetsBody: any[] = [];
      // TODO
      // Call transformer service to transform vendori quote to SF data before calling SF service.
      for (const quoteProduct of quote.quotesProducts) {
        const body = {
          productId: quoteProduct.productId,
          bundleId: quoteProduct.bundleId,
          customerId: quote.customerId,
          companyId: quote.companyId,
          quantity: quoteProduct.quantity,
          endDate: quoteProduct.endDate,
          customerPrice: 0,
          netPrice: 0,
        };
        const res = await this.customerProductRepo.insert(body);
        const customerProductId = res.identifiers[0]['customerProductId'];

        // TODO
        // If product is bundled, need to create parent asset with this bundle

        if (quoteProduct.product.sfProductId) {
          const assetBody = SFFieldMappingUtil.assetFieldMapping(
            quote,
            quoteProduct,
            customerProductId,
          );
          assetsBody.push(assetBody);
        }
      }
      await this.salesforceService.createAsset(assetsBody);
      await job.progress(100);
    } catch (error) {
      this.logger.error({
        func: `${JobNames.CreateAssetToSF}/process`,
        error,
      });

      throw error;
    }
  }
  @Process(JobNames.RealTimeSyncProductToSF)
  async realTimeSyncProduct(job: Job) {
    await job.progress(0);

    try {
      const product = await this.productRepo
        .createQueryBuilder('product')
        .where('product.productId = :productId', {
          productId: job.data.payload.productId,
        })
        .leftJoinAndSelect('product.pricingModel', 'pricingModel')
        .leftJoinAndSelect('product.productHierarchy', 'productHierarchy')
        .getOne();
      // TODO
      // Call transformer service to transform vendori quote to SF data before calling SF service.
      if (product) {
        await this.salesforceService.realTimeSyncProduct(
          product,
          job.data.deleted,
        );
      }
      await job.progress(100);
    } catch (error) {
      this.logger.error({
        func: `${JobNames.RealTimeSyncProductToSF}/process`,
        error,
      });

      throw error;
    }
  }
}
