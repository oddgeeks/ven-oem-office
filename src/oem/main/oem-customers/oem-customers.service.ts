import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { OemCustomerEntity } from './oem-customer.entity';
import { OemAddressEntity } from '../oem-addresses/oem-address.entity';
import { AddressTypeEnum } from '../oem-addresses/oem-address.enums/address-type.enum';
import { OemCustomerAddresses } from '../../intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';
import { OemSalesforceService } from '../oem-salesforce/oem-salesforce.service';
import { OpportunityAccountGetDto } from '../../../shared/salesforce/salesforce.dto/opportunity-account.dto';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { ISalesforceMetaData } from '../../../shared/salesforce/salesforce.types/salesforce.sf_metadata.type';

@Injectable()
@CommonDefaultMethodExtension
export class OemCustomersService extends TypeOrmCrudService<OemCustomerEntity> {
  private readonly logger = new Logger(OemCustomersService.name);

  constructor(
    @InjectRepository(OemCustomerEntity)
    public repo: Repository<OemCustomerEntity>,
    private readonly salesforceService: OemSalesforceService,
  ) {
    super(repo);
  }

  async integrateCustomerSalesforce(
    req: any,
    params: OpportunityAccountGetDto,
    sfObject?: ISalesforceMetaData,
  ): Promise<Partial<OemCustomerEntity>> {
    try {
      const { companyId } = req.user;
      const { idOpportunity } = params;

      let salesforceData: object;
      if (sfObject) {
        salesforceData = [
          { Id: sfObject['opportunityId'], ...sfObject.account },
        ];
      } else
        salesforceData = await this.salesforceService.getOpportunityCustomer({
          companyId,
          idOpportunity,
        });

      this.logger.log({
        func: 'OemCustomersService/integrateCustomerSalesforce',
        salesforceData,
      });

      return this.repo.manager.transaction(async (manager) => {
        const organizationId = salesforceData[0].Id;
        const salesOrganizationId =
          salesforceData[1]?.AccountId || salesforceData[0].AccountId;

        const {
          Industry: industry,
          Name: customerName,
          Phone: phone,

          BillingStreet,
          BillingCity,
          BillingState,
          BillingPostalCode,
          BillingCountry,

          ShippingStreet,
          ShippingCity,
          ShippingState,
          ShippingPostalCode,
          ShippingCountry,
        } = salesforceData[1] || salesforceData[0];

        const billingAddressData = {
          address_1: `${BillingStreet}`,
          address_2: null,
          address_3: null,
          city: `${BillingCity}`,
          region: `${BillingState}`,
          zipCode: `${BillingPostalCode}`,
          country: `${
            BillingCountry === '-' ? 'United States' : BillingCountry
          }`,
          phone,
          isEnabled: true,
          companyId: req.user.companyId,
          addressType: AddressTypeEnum.BILLING,
        };
        let billingAddress: Partial<OemAddressEntity> = await manager.findOne(
          OemAddressEntity,
          {
            where: billingAddressData,
          },
        );
        if (!billingAddress) {
          billingAddress = await manager.save(
            manager.getRepository(OemAddressEntity).create(billingAddressData),
          );
        }

        const shippingAddressData = {
          address_1: `${ShippingStreet}`,
          address_2: null,
          address_3: null,
          city: `${ShippingCity}`,
          zipCode: `${ShippingPostalCode}`,
          region: `${ShippingState}`,
          country: `${
            ShippingCountry === '-' ? 'United States' : ShippingCountry
          }`,
          phone,
          isEnabled: true,
          companyId: req.user.companyId,
          addressType: AddressTypeEnum.SHIPPING,
        };
        let shippingAddress: Partial<OemAddressEntity> = await manager.findOne(
          OemAddressEntity,
          {
            where: shippingAddressData,
          },
        );
        if (!shippingAddress) {
          shippingAddress = await manager.save(
            manager.getRepository(OemAddressEntity).create(shippingAddressData),
          );
        }

        const customerData = {
          licensingProgramId: 1,
          organizationId,
          salesOrganizationId,
          customerName,
          industry,
          phone,
          isEnabled: true,
          companyId,
        };
        let customer: Partial<OemCustomerEntity> = await manager.findOne(
          OemCustomerEntity,
          {
            where: customerData,
          },
        );

        if (!customer)
          customer = await manager.save(
            this.repo.create({
              ...customerData,
              logoUrl:
                'https://files.vendori.com/images/33660502-30b1-499a-ad87-bbf525c0b3c9.png?Expires=1705460746&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9maWxlcy52ZW5kb3JpLmNvbS9pbWFnZXMvMzM2NjA1MDItMzBiMS00OTlhLWFkODctYmJmNTI1YzBiM2M5LnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTcwNTQ2MDc0Nn19fV19&Signature=czG8lRcQs7d5BxFeG48l9qLagla4ZmKn7v~~0FChMom0jban27upjLw8l5RO0xsa8Kq8~CbdnwGr~jdivqt4VpbozKpeJleLeRZeD66-XCUFckAz59dytOCTXkbugFqAla5T8jVSyLjtsAOrf4GWBf1muJdwNAirIAjkMEopduX3mhOSqIyFnMZXUiXjcjf3OSjkjcw-NvFR4gWB3QpxrijDDq47793fqVszcF92lbBDst18AN1s9jQ5pFuAxrXrRwjxDOiVapu5AD6-PkE7JBrx43MM0EAGISmPZ6GY4Xs6wHt4O~YQOLDSw7trKv64tTs05ieRaoy4OjvYKZGY7A__&Key-Pair-Id=K3W4UV0J4B6YE7',
            }),
          );

        await manager.save(
          manager.getRepository(OemCustomerAddresses).create({
            companyId,
            customerId: customer.customerId,
            addressId: billingAddress.addressId,
          }),
        );

        await manager.save(
          manager.getRepository(OemCustomerAddresses).create({
            companyId: req.user.companyId,
            customerId: customer.customerId,
            addressId: shippingAddress.addressId,
          }),
        );

        return manager
          .createQueryBuilder(OemCustomerEntity, 'customer')
          .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
          .leftJoinAndSelect('customerAddresses.address', 'address')
          .where({ customerId: customer.customerId })
          .getOne();
      });
    } catch (error) {
      this.logger.error({
        func: 'OemCustomersService/integrateCustomerSalesforce',
        error,
      });

      throw error;
    }
  }
}
