import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OemQuotesCustomerProducts } from './oem-quotes-customer-products.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuotesCustomerProductsService extends TypeOrmCrudService<OemQuotesCustomerProducts> {
  constructor(@InjectRepository(OemQuotesCustomerProducts) repo) {
    super(repo);
  }

  /**
   * Checks if there is enabled product with given `quoteId` and `customerId`.
   * If there is, then changes `isEnabled` to false. Otherwise rejects with not found error.
   */
  async disableOne(params: {
    id: number;
    customerProductId: number;
  }): Promise<OemQuotesCustomerProducts> {
    const { id, customerProductId } = params;
    const quoteCustomerProduct = await this.repo.findOne({
      where: {
        quoteId: id,
        customerProductId: customerProductId,
        isEnabled: true,
      },
    });

    if (!quoteCustomerProduct) {
      throw new NotFoundException('OemQuotesCustomerProducts not found.');
    }

    quoteCustomerProduct.isEnabled = false;

    return this.repo.save(quoteCustomerProduct);
  }
}
