import * as _ from 'lodash';
import * as moment from 'moment-timezone';

import { OemCustomerAddresses } from '../../../oem/intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';
import { OemQuotesProducts } from '../../../oem/intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { AddressTypeEnum } from '../../../oem/main/oem-addresses/oem-address.enums/address-type.enum';
import { OemQuoteEntity } from '../../../oem/main/oem-quotes/oem-quote.entity';
import { OemProductEntity } from '../../../oem/main/oem-products/oem-product.entity';
import { EligibleForEnum } from '../../../oem/main/oem-products/oem-product.enums/eligible-for.enum';
import { OemHierarchyEntity } from '../../../oem/main/oem-hierarchies/oem-hierarchy.entity';
import { OemQuotesContacts } from '../../../oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';

// TODO: Cleanup the format & Use a configuration mapper between Salesforce and Vendori properties @saleforce_sync
export function opportunityFiledMapping(quote: OemQuoteEntity) {
  const billingAddress = quote.customer.customerAddresses.find(
    (customerAddress: OemCustomerAddresses) =>
      customerAddress.address.addressType === AddressTypeEnum.BILLING,
  );
  const shippingAddress = quote.customer.customerAddresses.find(
    (customerAddress: OemCustomerAddresses) =>
      customerAddress.address.addressType === AddressTypeEnum.SHIPPING,
  );
  let Gross_Margin_Percent__c = 0;
  let Gross_Margin_Amt__c = 0;
  let ACV__c = 0;
  let MRR__c = 0;
  let ARR__c = 0;
  let Customer_Discretionary_Discount_Percent__c = 0;
  let Customer_Discretionary_Discount_Amt__c = 0;
  let Customer_Program_Discount_Amt__c = 0;
  let Customer_Program_Discount_Percent__c = 0;
  let Channel_Discretionary_Discount_Amt__c = 0;
  let Channel_Discretionary_Discount_Percent__c = 0;
  let Channel_Program_Discount_Amt__c = 0;
  let Channel_Program_Discount_Percent__c = 0;
  const totalProducts = quote.quotesProducts.length;
  quote.quotesProducts.forEach((p: OemQuotesProducts) => {
    Gross_Margin_Percent__c += _.get(
      p.lockedFields,
      'grossMarginPercentage',
      0,
    );
    Gross_Margin_Amt__c += _.get(p.lockedFields, 'grossMarginDollar', 0);
    ACV__c += _.get(p.lockedFields, 'anual_contract_value', 0);
    MRR__c += _.get(p.lockedFields, 'monthly_recurring_revenue', 0);
    ARR__c += _.get(p.lockedFields, 'annual_recurring_revenue', 0);
    Customer_Discretionary_Discount_Percent__c += _.get(
      p.lockedFields,
      'discounts.customer[0].percentage',
      0,
    );
    Customer_Discretionary_Discount_Amt__c += _.get(
      p.lockedFields,
      'discounts.customer[0].value',
      0,
    );
    Customer_Program_Discount_Amt__c += _.get(
      p.lockedFields,
      'discounts.customer[1].value',
      0,
    );
    Customer_Program_Discount_Percent__c += _.get(
      p.lockedFields,
      'discounts.customer[1].percentage',
      0,
    );
    Channel_Discretionary_Discount_Amt__c += _.get(
      p.lockedFields,
      'discounts.channel[0].value',
      0,
    );
    Channel_Discretionary_Discount_Percent__c += _.get(
      p.lockedFields,
      'discounts.channel[0].percentage',
      0,
    );
    Channel_Program_Discount_Amt__c += _.get(
      p.lockedFields,
      'discounts.channel[1].value',
      0,
    );
    Channel_Program_Discount_Percent__c += _.get(
      p.lockedFields,
      'discounts.channel[1].percentage',
      0,
    );
  });
  return {
    Id: quote.opportunityId,
    Vendori_Opportunity_Id__c: quote.quoteId,
    Name: quote.quoteName,
    // Primary_Quote_Status__c: quote.quoteStatus,
    Deal_Type__c: quote.dealType,
    CloseDate: quote.expiresAt,
    ...(quote.ownerUser?.sfUserId && { OwnerId: quote.ownerUser?.sfUserId }),
    Primary_Vendori_Quote__c: quote.quoteId,
    ...(quote.sfContractId && { ContractId: quote.sfContractId }),
    // Delivery_Status__c: quote.deliveryStatus, // Value should be matched
    ...(quote.signedDate && { Date_of_Signature__c: quote.signedDate }),
    ...(quote.approvedDate && {
      Internal_Approval_Completed_On__c: quote.approvedDate,
    }),
    ...(billingAddress && {
      Billing_Address__Street__s: billingAddress.address?.address_1,
      Billing_Address__City__s: billingAddress.address.city,
      Billing_Address__PostalCode__s: billingAddress.address.zipCode,
      // Billing_Address__StateCode__s: billingAddress.address.stateCode, // stateCode should be created in address entity
      // Billing_Address__CountryCode__s: billingAddress.address.country, // It should be country code instead of country i.e. AF for Afghanistan. countryCode should be created, too
    }),
    ...(shippingAddress && {
      Shipping_Address__Street__s: shippingAddress.address?.address_1,
      Shipping_Address__City__s: shippingAddress.address.city,
      Shipping_Address__PostalCode__s: shippingAddress.address.zipCode,
      // Shipping_Address__StateCode__s: shippingAddress.address.stateCode, // stateCode should be created in address entity
      // Shipping_Address__CountryCode__s: shippingAddress.address.country, // It should be country code instead of country i.e. AF for Afghanistan. countryCode should be created, too
    }),
    Gross_Margin_Percent__c: Boolean(totalProducts)
      ? Gross_Margin_Percent__c / totalProducts
      : 0,
    Gross_Margin_Amt__c,
    ACV__c,
    MRR__c,
    ARR__c,
    Customer_Discretionary_Discount_Percent__c: Boolean(totalProducts)
      ? Customer_Discretionary_Discount_Percent__c / totalProducts
      : 0,
    Customer_Discretionary_Discount_Amt__c,
    Customer_Program_Discount_Amt__c,
    Customer_Program_Discount_Percent__c: Boolean(totalProducts)
      ? Customer_Program_Discount_Percent__c / totalProducts
      : 0,
    Channel_Discretionary_Discount_Amt__c,
    Channel_Discretionary_Discount_Percent__c: Boolean(totalProducts)
      ? Channel_Discretionary_Discount_Percent__c / totalProducts
      : 0,
    Channel_Program_Discount_Amt__c,
    Channel_Program_Discount_Percent__c: Boolean(totalProducts)
      ? Channel_Program_Discount_Percent__c / totalProducts
      : 0,
  };
}
export function quoteFieldMapping(quotes: OemQuoteEntity[]) {
  const upsertBody = quotes.reduce((acc: any[], quote: OemQuoteEntity) => {
    if (!quote.opportunityId) return acc; // OpportunityID is mandatory in salesforce
    acc.push({
      Name: quote.quoteName,
      Primary__c: quote.isPrimary,
      Status: quote.quoteStatus,
      Vendori_Quote_ID__c: `${quote.quoteId}`,
      Amount__c: quote.netAmount,
      OwnerId: quote.ownerUser.sfUserId,
      OpportunityId: quote.opportunityId,
      Vendori_Quote_Users__c: quote.ownerUserId,
    });
    return acc;
  }, []);
  return upsertBody;
}

export function quoteProductFieldMapping(quotes: OemQuoteEntity[]) {
  const quoteProductsToUpdate = [];
  const quoteProductsToCreate = [];
  quotes.forEach((q: OemQuoteEntity) => {
    q.quotesProducts.forEach((p: OemQuotesProducts) => {
      if (!q.opportunityId || !p.product.sfProductId) return;
      const baseBody = {
        // Name: p.product.productName, //INVALID_FIELD_FOR_INSERT_UPDATE:Unable to create/update fields: ProductCode, Name
        Vendori_Quote_Product_ID__c: p.quoteProductId,
        // ...(p.product.pricingModel?.modelName && {
        //   Pricing_Model__c: p.product.pricingModel?.modelName,
        // }),
        // ...(p.product.pricingModel?.modelType && {
        //   Pricing_Model_Type__c: p.product.pricingModel?.modelType,
        // }),
        // ...(p.product.pricingModel?.pricingType && {
        //   Pricing_Type__c: p.product.pricingModel?.pricingType,
        // }),
        // ...(p.product.skuNumber && { ProductCode: p.product.skuNumber }), //INVALID_FIELD_FOR_INSERT_UPDATE:Unable to create/update fields: ProductCode, Name
        ...(p.product.skuNumber && { Product_SKU__c: p.product.skuNumber }),
        Quantity: p.quantity,
        // ...(p.startDate && { Start_Date__c: p.startDate }),
        // ...(p.endDate && { End_Date__c: p.endDate }),
        // ...(p.product.billingFrequency && {
        //   Billing_Frequency__c: p.product.billingFrequency,
        // }),
        // Subtotal: p.lockedFields['impliedCustomerPrice'] ?? 0, // It does not work for salesforce for now even it has this field
        // UnitPrice: p.lockedFields['perUnitPerYear'] ?? 10,
        TotalPrice: 10, // hardcode for now
        Gross_Margin_Percent__c: _.get(
          p.lockedFields,
          'grossMarginPercentage',
          0,
        ),
        Gross_Margin_Amt__c: _.get(p.lockedFields, 'grossMarginDollar', 0),
        Cost_of_Goods_Sold__c: _.get(p.lockedFields, 'cogsDollar', 0),
        Default_Term__c: _.get(p.lockedFields, 'product.term', 0),
        // Default_Term_Type__c: _.get(p.lockedFields, 'product.termType', ''), // Value should be matched to picklist of salesforce
        Package__c: Boolean(p.bundleId),
        Unit_Cost__c: _.get(p.lockedFields, 'perUnitPerYear', 0),
        // Unit_Duration__c: _.get(
        //   p.lockedFields,
        //   'pricingModel.unitDuration',
        //   '',
        // ), // Value should be matched to picklist of salesforce
        // Unit_Metric__c: _.get(p.lockedFields, 'pricingModel.unitMetric', ''), // Value should be matched to picklist of salesforce
        ACV__c: _.get(p.lockedFields, 'anual_contract_value', 0),
        MRR__c: _.get(p.lockedFields, 'monthly_recurring_revenue', 0),
        ARR__c: _.get(p.lockedFields, 'annual_recurring_revenue', 0),
        Customer_Discretionary_Discount_Percent__c: _.get(
          p.lockedFields,
          'discounts.customer[0].percentage',
          0,
        ),
        Customer_Discretionary_Discount_Amt__c: _.get(
          p.lockedFields,
          'discounts.customer[0].value',
          0,
        ),
        Customer_Program_Discount_Amt__c: _.get(
          p.lockedFields,
          'discounts.customer[1].value',
          0,
        ),
        Customer_Program_Discount_Percent__c: _.get(
          p.lockedFields,
          'discounts.customer[1].percentage',
          0,
        ),
        Channel_Discretionary_Discount_Amt__c: _.get(
          p.lockedFields,
          'discounts.channel[0].value',
          0,
        ),
        Channel_Discretionary_Discount_Percent__c: _.get(
          p.lockedFields,
          'discounts.channel[0].percentage',
          0,
        ),
        Channel_Program_Discount_Amt__c: _.get(
          p.lockedFields,
          'discounts.channel[1].value',
          0,
        ),
        Channel_Program_Discount_Percent__c: _.get(
          p.lockedFields,
          'discounts.channel[1].percentage',
          0,
        ),
      };
      if (p.sfOpportunityProductId) {
        quoteProductsToUpdate.push({
          ...baseBody,
          Id: p.sfOpportunityProductId,
        });
      } else {
        quoteProductsToCreate.push({
          ...baseBody,
          Product2Id: p.product.sfProductId,
          OpportunityId: q.opportunityId,
        });
      }
    });
  });
  return [quoteProductsToCreate, quoteProductsToUpdate];
}

export function assetFieldMapping(
  quote: OemQuoteEntity,
  quoteProduct: OemQuotesProducts,
  customerProductId: number,
) {
  return {
    Vendori_Asset_Id__c: customerProductId,
    Name: quoteProduct.product.productName,
    AccountId: quote.customer.salesOrganizationId,
    Product2Id: quoteProduct.product.sfProductId,
    Quantity: quoteProduct.quantity,
    OriginalQuantity__c: quoteProduct.quantity,
    Partofbundle__c: Boolean(quoteProduct.bundleId),
    Active_Product__c: true,
    ...(quoteProduct.product.productDescription && {
      Description: quoteProduct.product.productDescription,
    }),
    ...(quoteProduct.endDate && {
      End_Date__c: moment(quoteProduct.endDate).format('YYYY-MM-DD'),
    }),
    ...(quoteProduct.startDate && {
      Start_Date__c: moment(quoteProduct.startDate).format('YYYY-MM-DD'),
    }),
    List_Price__c: _.get(quoteProduct.lockedFields, 'listPrice', 0),
    ...(quote.opportunityId && {
      Original_Opportunity__c: quote.opportunityId,
    }),
    ...(quoteProduct.sfOpportunityProductId && {
      Original_Opporutnity_Product__c: quoteProduct.sfOpportunityProductId,
    }),
    Bundle_Header__c: Boolean(quoteProduct.bundleId),
    // ParentId: // If product is bundled, should create asset first and then use that asset id as parentId
    // Parent_Product__c: // sfProduct id of parent asset
    // ...(quoteProduct.product.pricingModel.pricingType && {PricingType__c: quoteProduct.product.pricingModel.pricingType}), // Not match
    // ...(quoteProduct.product.pricingModel.modelType && {PricingModelType__c: quoteProduct.product.pricingModel.modelType}), // Not match
    UnitCost__c: _.get(quoteProduct.lockedFields, 'perUnitPerYear', 0),
    // Unit_Duration__c: _.get(quoteProduct.lockedFields, 'pricingModel.unitDuration', ''), // Value should be matched to picklist of salesforce
    // Unit_Metric__c: _.get(quoteProduct.lockedFields, 'pricingModel.unitMetric', ''), // Value should be matched to picklist of salesforce
    ...(quoteProduct.product.billingFrequency && {
      BillingFrequencyNotes__c: quoteProduct.product.billingFrequency,
    }),
    ...(quote.signedDate && {
      PurchaseDate: moment(quote.signedDate).format('YYYY-MM-DD'),
    }),
    ...(quoteProduct.endDate && {
      UsageEndDate: moment(quoteProduct.endDate).format('YYYY-MM-DD'),
    }),
    ...(quoteProduct.startDate && {
      StartDateUTC__c: moment(quoteProduct.startDate).utc().toISOString(),
    }),
  };
}

export function quoteContactFieldMapping(quotesContacts: OemQuotesContacts[]) {
  const body = quotesContacts.reduce(
    (
      acc: { insert: any[]; destroy: any[] },
      quoteContact: OemQuotesContacts,
    ) => {
      if (
        !quoteContact.quote.opportunityId ||
        !quoteContact.contact.sfContactId
      )
        return acc;
      if (quoteContact.isEnabled && !quoteContact.sfOpportunityContactRoleId) {
        acc.insert.push({
          OpportunityId: quoteContact.quote.opportunityId,
          ContactId: quoteContact.contact.sfContactId,
          Vendori_Contact_ID__c: quoteContact.contactId,
          Vendori_Quote_ID__c: quoteContact.quoteId,
        });
      } else if (
        !quoteContact.isEnabled &&
        quoteContact.sfOpportunityContactRoleId
      ) {
        acc.destroy.push(quoteContact.sfOpportunityContactRoleId);
      }
      return acc;
    },
    { insert: [], destroy: [] },
  );
  return body;
}

/* Product filed mapping */
export function productFieldMapping(
  p: OemProductEntity,
  hierarchy: OemHierarchyEntity,
) {
  return {
    // ExternalId: p.productId,
    // ExternalDataSourceId: p.productId,
    Vendori_Product__c: p.productId,
    Name: p.productName,
    Description: p.productDescription ?? '',
    ProductCode: p.productCode ?? '',
    Product_Code__c: p.productCode ?? '',
    Quantity__c: 1, // hardcoded for now
    // ...(p.billingFrequency && { Billing_Frequency__c: p.billingFrequency }), // not match picklist value
    // ...(p.pricingModel.modelType && { Pricing_Model__c: p.pricingModel.modelType, }), // not match picklist value
    // ...(p.pricingModel.unitMetric && {Unit_Metric__c: p.pricingModel.unitMetric,}), // Not match
    IsActive: p.isEnabled,
    DisplayUrl: 'https://staging.vendori.com/admin/product-price-list',
    Product_Class__c: hierarchy.hierarchyName,
    // ...(_.get(hierarchy, 'parent.hierarchyName') && {Family: _.get(hierarchy, 'parent.hierarchyName')}), // should be text instead of picklist
    // ...(_.get(hierarchy, 'parent.parent.hierarchyName') && {Product_Type__c: _.get(hierarchy, 'parent.parent.hierarchyName')}), // should be text instead of picklist
    StockKeepingUnit: p.skuNumber ?? '',
    // ...(p.pricingModel.unitDuration && {QuantityUnitOfMeasure: p.pricingModel.unitDuration}), // not match picklist value
    ...(p.term && { Default_Term__c: p.term }),
    ...(p.termType && { Default_Term_Type__c: p.termType }),
    // Product_Availability__c: p.productAvailability,
    Expansion_Product__c: p.eligibleFor.includes(EligibleForEnum.EXPANSION),
    Extension_Product__c: p.eligibleFor.includes(EligibleForEnum.EXTENSION),
    Upgrade_Product__c: p.eligibleFor.includes(EligibleForEnum.UPGRADEABLE),
    Downgrade_Product__c: p.eligibleFor.includes(EligibleForEnum.DOWNGRADEBLE),
  };
}

export function priceBookEntryFieldMapping(
  sfProductId: string,
  sfPriceBookId: string,
  unitPrice = 0,
) {
  return {
    Pricebook2Id: sfPriceBookId,
    Product2Id: sfProductId,
    UnitPrice: unitPrice,
  };
}
