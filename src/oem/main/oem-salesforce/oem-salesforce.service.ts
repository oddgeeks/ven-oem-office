import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SalesforceService } from '../../../shared/salesforce/salesforce.service';
import {
  OemContactListGetDto,
  OemOpportunityAccountGetDto,
} from './oem-salesforce.dto';
import { OemSalesforceTokenEntity } from './oem-salesforce-token.entity';
import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';
import { ISalesforceTokenObject } from '../../../shared/salesforce/salesforce.types/salesforce.oauth2-token.type';

@Injectable()
@SetCurrentTenant
export class OemSalesforceService {
  private readonly logger = new Logger(OemSalesforceService.name);
  private readonly EXPIRATION_ERROR =
    'invalid_grant: expired access/refresh token';

  constructor(
    @InjectRepository(OemSalesforceTokenEntity)
    public repo: Repository<OemSalesforceTokenEntity>,
    private readonly salesforceService: SalesforceService,
  ) {}

  /**
   * Gets salesforce token, then gets salesforce opportunity customer.
   * If there is error, and code is `401` (Token expiration error), updates token then recursively calls function again.
   */
  public async getOpportunityCustomer(params: OemOpportunityAccountGetDto) {
    const { companyId, idOpportunity } = params;

    try {
      const salesforceToken = await this._getToken(companyId);
      const opportunityData = {
        idOpportunity,
      };

      return this.salesforceService.getOpportunityCustomer(
        salesforceToken,
        opportunityData,
      );
    } catch (error) {
      const isAuthError = await this._handleTokenError(companyId, error);

      if (isAuthError) return this.getOpportunityCustomer(params);
      else {
        // Another error has occured and the request must be rejected
        this.logger.error({
          func: `${OemSalesforceService.name}/${this.getOpportunityCustomer.name}`,
          error,
          stack: error.stack,
        });

        throw error;
      }
    }
  }

  public async getContacts(params: OemContactListGetDto) {
    const { companyId } = params;

    try {
      const salesforceToken = await this._getToken(companyId);
      return await this.salesforceService.getContactList(salesforceToken);
    } catch (error) {
      const isAuthError = await this._handleTokenError(companyId, error);

      if (isAuthError) return this.getContacts(params);
      else {
        // Another error has occured and the request must be rejected
        this.logger.error({
          func: `${OemSalesforceService.name}/${this.getOpportunityCustomer.name}`,
          error,
        });

        throw error;
      }
    }
  }

  /**
   * Stores given `salesforceToken` data into DB for current `companyId`.
   */
  private async _storeSalesforceTokenInDB(
    companyId: number,
    salesforceToken: ISalesforceTokenObject,
  ) {
    const withData = {
      companyId,
      token: salesforceToken.token,
      instanceUrl: salesforceToken.instanceUrl,
      issuedAt: salesforceToken.issuedAt,
    };
    const createdRecord = this.repo.create(withData);

    return this.repo.save(createdRecord);
  }

  /**
   * Retrieves salesforce token data by given `companyId`.
   */
  private async _getSalesforceTokenFromDB(companyId: number) {
    const withCriteria = {
      where: {
        companyId,
        isEnabled: true,
      },
    };

    return this.repo.findOne(withCriteria);
  }

  /**
   * Gets salesforce token data from db by `companyId`.
   * If there is such object, then returns it.
   * Otherwise calls salesforce library to get new token and stores it.
   */
  private async _getToken(companyId: number) {
    const salesforceTokenEntity = await this._getSalesforceTokenFromDB(
      companyId,
    );

    if (salesforceTokenEntity) return salesforceTokenEntity;

    const salesforceToken = await this.salesforceService.getTokenObject();

    return this._storeSalesforceTokenInDB(companyId, salesforceToken);
  }

  private async _handleTokenError(
    companyId: number,
    error: UnauthorizedException | any,
  ): Promise<boolean> {
    const errorTypeIsAuthRelated =
      error.stack === this.EXPIRATION_ERROR ||
      error.toString().match(/login error|Unauthorized/i) !== null;

    if (errorTypeIsAuthRelated) {
      // We have to delete the current token on the database, reset the password (SALESFORCE_PASSWORD) on salesforce, and get the token again
      await this.repo.delete({
        companyId,
        isEnabled: true,
      });

      const salesforceToken = await this.salesforceService.refreshToken();

      await this._storeSalesforceTokenInDB(companyId, salesforceToken);
    }

    return errorTypeIsAuthRelated;
  }
}
