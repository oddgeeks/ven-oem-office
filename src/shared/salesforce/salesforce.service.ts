import { BulkOptions, Connection as SalesforceClient } from 'jsforce';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import * as _ from 'lodash';

import { SALESFORCE_PASSWORD, SALESFORCE_USERNAME } from '../../environments'; //TODO: we should move every configuration to module

import { OpportunityAccountGetDto } from './salesforce.dto/opportunity-account.dto';
import {
  ISalesforceTokenObject,
  ISalesforceTokenParams,
} from './salesforce.types/salesforce.oauth2-token.type';
import { OemQuoteEntity } from '../../oem/main/oem-quotes/oem-quote.entity';
import { OemQuotesProducts } from '../../oem/intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import * as SFFieldMappingUtil from './salesforce.utils/field-mapping.salesforce.util';
import { OemProductEntity } from '../../oem/main/oem-products/oem-product.entity';
import { OemSalesforceIntegrationEntity } from '../../oem/main/oem-integrations/oem-salesforce-integrations/oem-salesforce-integration.entity';
import { OemHierarchyEntity } from '../../oem/main/oem-hierarchies/oem-hierarchy.entity';
import { OemQuotesContacts } from '../../oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';

@Injectable()
export class SalesforceService {
  constructor(
    @Inject(Logger)
    private readonly logger: Logger,
    @Inject(SalesforceClient)
    private readonly connection: SalesforceClient,
    @InjectRepository(OemQuoteEntity)
    private quoteRepo: Repository<OemQuoteEntity>,
    @InjectRepository(OemQuotesProducts)
    private quoteProductRepo: Repository<OemQuotesProducts>,
    @InjectRepository(OemProductEntity)
    private productRepo: Repository<OemProductEntity>,
    @InjectRepository(OemSalesforceIntegrationEntity)
    private sfIntegrationRepo: Repository<OemSalesforceIntegrationEntity>,
    @InjectRepository(OemHierarchyEntity)
    private hierarchyTreeRepo: TreeRepository<OemHierarchyEntity>,
    @InjectRepository(OemQuotesContacts)
    private quoteContactRepo: TreeRepository<OemQuotesContacts>,
  ) {
    this.connection
      .login(SALESFORCE_USERNAME, SALESFORCE_PASSWORD)
      .catch((salesforceError: Error) =>
        this._riseConnectionError(salesforceError),
      );

    this.logger = new Logger(SalesforceService.name);
  }

  /**
   * Logs error and throws `ForbiddenExeption` for Salesforce login failure.
   */
  private _riseConnectionError(error?: Error) {
    this.logger.error({
      func: 'SalesforceService/constructor',
      error,
    });

    throw new UnauthorizedException('Salesforce Error: Login error.');
  }

  /**
   * Checks if limit is reached, then throws `ForbiddenException`.
   */
  private _isRateLimitReached() {
    if (this.connection.limitInfo && this.connection.limitInfo.apiUsage) {
      const { limit, used } = this.connection.limitInfo.apiUsage;

      if (limit - used === 0) {
        this.logger.error({
          func: `${SalesforceService.name}/${this._isRateLimitReached.name}`,
          error: 'Rate limit is reached.',
        });

        throw new ForbiddenException('Salesforce Error: API Timed out.');
      }
    }
  }

  /**
   * Logs `functionName` related error and checks if rate limit is reached or not.
   */
  private _riseAPIError(functionName: string, error: Error) {
    this.logger.error({
      func: `${SalesforceService.name}/${functionName}`,
      error,
    });

    this._isRateLimitReached();

    throw error;
  }

  /**
   * Flattens given `tokenParams` object.
   */
  private _transformOauthToken(
    tokenParams: ISalesforceTokenParams,
  ): ISalesforceTokenObject {
    const { accessToken, instanceUrl } = tokenParams;

    return {
      token: accessToken,
      instanceUrl,
      issuedAt: moment().utc().toDate(),
    };
  }

  /**
   * Logs in into salesforce then returns new token object.
   */
  public async refreshToken() {
    try {
      await this.connection.login(SALESFORCE_USERNAME, SALESFORCE_PASSWORD);

      return this.getTokenObject();
    } catch (error) {
      this._riseConnectionError(error);
    }
  }

  /**
   * Grabs `accessToken`, processes it with `_transformOauthToken`.
   */
  public getTokenObject(): ISalesforceTokenObject {
    const { accessToken, instanceUrl } = this.connection;

    if (!accessToken) this._riseConnectionError();

    return this._transformOauthToken({
      accessToken,
      instanceUrl,
    });
  }

  /**
   * 1. Fetches opportunity by `idOpportunity` from params.
   * 2. Then checks if `idAccount` property is missing,
   *  then makes recursive call with parsed account id from opportunity response.
   * 3. And then fetches also account data.
   */
  public async getOpportunityCustomer(
    oauth2Token: ISalesforceTokenObject, // will be used after moving credentials to database
    params: OpportunityAccountGetDto,
  ) {
    try {
      const batchRequests = [];

      batchRequests.push(
        this.connection.sobject('Opportunity').retrieve(params.idOpportunity),
      );

      if (!params.idAccount) {
        const [opportunity] = await Promise.all(batchRequests);

        const accountId = opportunity.AccountId;
        params.idAccount = accountId?.slice(0, accountId.length - 3);

        return this.getOpportunityCustomer(oauth2Token, params);
      }

      batchRequests.push(
        this.connection.sobject('Account').retrieve(params.idAccount),
      );

      return Promise.all(batchRequests);
    } catch (error) {
      const functionName = this.getOpportunityCustomer.name;

      this._riseAPIError(functionName, error);
    }
  }

  public async getContactList(oauth2Token: ISalesforceTokenObject) {
    try {
      return await this.connection.sobject('Contact').find();
    } catch (error) {
      const functionName = this.getContactList.name;

      this._riseAPIError(functionName, error);
    }
  }

  public async realTimeSyncQuote(quote: OemQuoteEntity) {
    try {
      let quotes = [quote];
      if (!quote || !quote.opportunityId) return;
      const opportunity = await this.connection
        .sobject('Opportunity')
        .retrieve(quote.opportunityId);
      // Check if quote is changed to primary or not and if yes, need to wipe out current opp products.
      if (quote.quoteId !== +opportunity['Primary_Vendori_Quote__c']) {
        // Need to remove related quotes before removing opp products
        await this.connection
          .sobject('Quote')
          .find({ OpportunityId: opportunity.Id })
          .destroy();

        // Wipe out the current opportunity products
        await this.connection
          .sobject('OpportunityLineItem')
          .find({ OpportunityId: opportunity.Id })
          .destroy();
        // Get all quotes and sync them
        quotes = await this.quoteRepo
          .createQueryBuilder('quotes')
          .where('quotes.opportunityId = :opportunityId', {
            opportunityId: quote.opportunityId,
          })
          .leftJoinAndSelect('quotes.ownerUser', 'user')
          .leftJoinAndSelect('quotes.customer', 'customer')
          .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
          .leftJoinAndSelect('customerAddresses.address', 'address')
          .leftJoinAndSelect('quotes.quotesProducts', 'quotesProducts')
          .leftJoinAndSelect('quotesProducts.product', 'product')
          .leftJoinAndSelect('product.pricingModel', 'pricingModel')
          .getMany();
      }
      await this.batchSyncQuote(quotes);
    } catch (error) {
      const functionName = this.realTimeSyncQuote.name;

      this._riseAPIError(functionName, error);
    }
  }

  public async createAsset(assetsBody: any[]) {
    try {
      if (assetsBody.length) {
        this.handleSFBulkCreateJob('Asset', 'upsert', assetsBody, null, {
          extIdField: 'Vendori_Asset_Id__c',
        });
      }
    } catch (error) {
      const functionName = this.createAsset.name;

      this._riseAPIError(functionName, error);
    }
  }

  public async batchSyncQuote(quotes: OemQuoteEntity[]) {
    try {
      // Quotes sync
      const upsertBody = SFFieldMappingUtil.quoteFieldMapping(quotes);

      if (upsertBody.length) {
        this.handleSFBulkCreateJob(
          'Quote',
          'upsert',
          upsertBody,
          (id: string) => {
            this.syncSFQuoteId(id);
          },
          { extIdField: 'Vendori_Quote_ID__c' },
        );
      }

      const primaryQuotes = quotes.filter(
        (q: OemQuoteEntity) => q.isPrimary && !!q.opportunityId,
      );
      // Primary quotes sync
      await this.syncPrimaryQuoteWithSF(primaryQuotes);

      // Quote Products sync
      // We sync quotes which are only primary to opportunity
      await this.syncQuoteProductsWithSF(primaryQuotes);
    } catch (error) {
      const functionName = this.batchSyncQuote.name;

      this._riseAPIError(functionName, error);
    }
  }

  private async syncPrimaryQuoteWithSF(quotes: OemQuoteEntity[]) {
    const requestBody = quotes.map((quote: OemQuoteEntity) =>
      SFFieldMappingUtil.opportunityFiledMapping(quote),
    );
    await this.connection.sobject('Opportunity').update(requestBody);
  }

  private async syncQuoteProductsWithSF(quotes: OemQuoteEntity[]) {
    const [quoteProductsToCreate, quoteProductsToUpdate] =
      SFFieldMappingUtil.quoteProductFieldMapping(quotes);

    if (quoteProductsToUpdate.length) {
      await this.connection
        .sobject('OpportunityLineItem')
        .update(quoteProductsToUpdate);
    }

    if (quoteProductsToCreate.length) {
      this.handleSFBulkCreateJob(
        'OpportunityLineItem',
        'insert',
        quoteProductsToCreate,
        (id: string) => {
          this.syncSFOpportunityProductId(id);
        },
      );
    }
  }

  private async syncSFQuoteId(sfQuoteId: string) {
    if (!sfQuoteId) return;
    const res = await this.connection.sobject('Quote').retrieve(sfQuoteId);

    await this.quoteRepo.update(res['Vendori_Quote_ID__c'], {
      sfQuoteId: res.Id,
      updatedAt: () => '"updated_at"',
    });
  }

  private async syncSFOpportunityProductId(sfOpportunityProductId: string) {
    if (!sfOpportunityProductId) return;
    const res = await this.connection
      .sobject('OpportunityLineItem')
      .retrieve(sfOpportunityProductId);

    await this.quoteProductRepo.update(res['Vendori_Quote_Product_ID__c'], {
      sfOpportunityProductId: res.Id,
      updatedAt: () => '"updated_at"',
    });
  }

  /* Quote Contact Syncing */
  public async batchSyncQuoteContact(quotesContacts: OemQuotesContacts[]) {
    try {
      // Quote Contacts sync
      const { insert, destroy } =
        SFFieldMappingUtil.quoteContactFieldMapping(quotesContacts);
      if (insert.length) {
        this.handleSFBulkCreateJob(
          'OpportunityContactRole',
          'insert',
          insert,
          (id: string) => {
            this.syncSFOpportunityContactRoleId(id);
          },
        );
      }
      if (destroy.length) {
        await this.connection.sobject('OpportunityContactRole').del(destroy);
      }
      for (const id of destroy) {
        await this.quoteContactRepo.update(
          { sfOpportunityContactRoleId: id },
          { sfOpportunityContactRoleId: '' },
        );
      }
    } catch (error) {
      const functionName = this.batchSyncQuoteContact.name;

      this._riseAPIError(functionName, error);
    }
  }

  private async syncSFOpportunityContactRoleId(
    sfOpportunityContactRoleId: string,
  ) {
    if (!sfOpportunityContactRoleId) return;
    const res = await this.connection
      .sobject('OpportunityContactRole')
      .retrieve(sfOpportunityContactRoleId);

    await this.quoteContactRepo.update(
      {
        quoteId: res['Vendori_Quote_ID__c'],
        contactId: res['Vendori_Contact_ID__c'],
      },
      {
        sfOpportunityContactRoleId: res.Id,
        updatedAt: () => '"updated_at"',
      },
    );
  }

  /* Product Syncing  */
  public async realTimeSyncProduct(product: OemProductEntity, deleted = false) {
    if (deleted && !product.sfProductId) return;
    if (deleted && product.sfProductId) {
      await this.connection.sobject('Product2').destroy(product.sfProductId);
      return;
    }
    const hierarchy = await this.hierarchyTreeRepo.findAncestorsTree(
      product.productHierarchy,
    );
    const upsertBody = SFFieldMappingUtil.productFieldMapping(
      product,
      hierarchy,
    );
    const res = await this.connection
      .sobject('Product2')
      .upsert(upsertBody, 'Vendori_Product__c');
    if (!product.sfProductId) {
      // Insert sf product id to vendori and add to standard pricebook
      await this.productRepo.update(product.productId, {
        sfProductId: res['id'],
      });
      // Get pricebook id from salesforce integration table
      const sfIntegration = await this.sfIntegrationRepo
        .createQueryBuilder('sfIntegration')
        .where('sfIntegration.companyId = :companyId', {
          companyId: product.companyId,
        })
        .getOne();
      if (!sfIntegration || !_.get(sfIntegration.settings, 'pricebookId'))
        return;
      await this.connection
        .sobject('PricebookEntry')
        .insert(
          SFFieldMappingUtil.priceBookEntryFieldMapping(
            res['id'],
            _.get(sfIntegration.settings, 'pricebookId'),
          ),
        );
    }
  }

  private handleSFBulkCreateJob(
    objectName: string,
    operation = 'insert',
    requestBody: any,
    callback?: (id: string) => void,
    extIdField?: BulkOptions,
  ) {
    const job = this.connection.bulk.createJob(
      objectName,
      operation,
      extIdField,
    );
    const batch = job.createBatch();
    batch.execute(requestBody);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // listen for events
    batch.on('error', function (batchInfo) {
      // fired when batch request is queued in server.
      that.logger.error({
        func: `${objectName}.${operation}/bulkCreation.error`,
        error: `${batchInfo}`,
      });
    });
    batch.on('queue', function (batchInfo) {
      // fired when batch request is queued in server.
      that.logger.log({
        func: `${objectName}.${operation}/bulkCreation.queue`,
        message: batchInfo,
      });
      batch.poll(1000 /* interval(ms) */, 20000 /* timeout(ms) */); // start polling - Do not poll until the batch has started
    });
    batch.on('response', function (rets) {
      // fired when batch finished and result retrieved
      for (let i = 0; i < rets.length; i++) {
        if (rets[i].success) {
          that.logger.log({
            func: `${objectName}.${operation}/bulkCreation.response`,
            message:
              '#' + (i + 1) + ' inserted successfully, id = ' + rets[i].id,
          });
          callback && callback(rets[i].id);
        } else {
          that.logger.error({
            func: `${objectName}.${operation}/bulkCreation.response`,
            message:
              '#' +
              (i + 1) +
              ' error occurred, message = ' +
              rets[i].errors.join(', '),
          });
        }
      }
    });
  }
}
