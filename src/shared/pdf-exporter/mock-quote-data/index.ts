import {
  defaultCompany,
  defaultCompanyAddress,
  defaultQuote,
} from './default-quote';

export enum QuotePDFDataType {
  Default = 'default',
  NoQuoteProducts = 'no-quote-products',
  NoQuoteContacts = 'no-quote-contacts',
  NoCompanyCustomerLogo = 'no-company-customer-logo',
  NoCustomer = 'no-customer',
  MoreThanThreeProducts = 'more-than-three-products',
  MoreThanThreeInvoiceSchedules = 'more-than-three-invoice-schedules',
  HideInvoiceContactUnit = 'hide-invoice-contact-unit',
  CustomPrimaryColor = 'custom-primary-color',
  DealTypeChannel = 'deal-type-channel',
}

/**
 * This is an entry point for all mock data
 * We can get data for
 * - "Default Quote"
 * - "Quote # of products = 7"
 * - "Quote # of products = 20"
 *
 */
export function getQuotePdfData(
  pdfDataType: QuotePDFDataType = QuotePDFDataType.Default,
) {
  const result = {
    quotes: null,
    company: null,
    companyAddress: null,
  };

  switch (pdfDataType) {
    case QuotePDFDataType.Default:
      result.quotes = [defaultQuote];
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      break;

    case QuotePDFDataType.NoQuoteProducts:
      result.quotes = [
        {
          ...defaultQuote,
          quotesProducts: [],
        },
      ];
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      break;

    case QuotePDFDataType.NoQuoteContacts:
      result.quotes = [
        {
          ...defaultQuote,
          quotesContacts: [],
        },
      ];
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      break;

    case QuotePDFDataType.NoCompanyCustomerLogo:
      result.quotes = [
        {
          ...defaultQuote,
          customer: {
            ...defaultQuote.customer,
            logoUrl: null,
          },
        },
      ];
      result.company = {
        ...defaultCompany,
        logoUrl: null,
      };
      result.companyAddress = defaultCompanyAddress;
      break;

    case QuotePDFDataType.NoCustomer:
      result.quotes = [
        {
          ...defaultQuote,
          customer: null,
        },
      ];
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      break;

    case QuotePDFDataType.MoreThanThreeProducts:
      {
        const quotesProducts = [...defaultQuote.quotesProducts];
        quotesProducts.push(
          JSON.parse(JSON.stringify(defaultQuote.quotesProducts[0])),
        );
        quotesProducts[0].invoiceSchedule.currentBillingFrequency = 'Bi-weekly';
        quotesProducts[1].invoiceSchedule.currentBillingFrequency =
          'Every 30 Days';
        quotesProducts[2].invoiceSchedule.currentBillingFrequency = 'Weekly';
        quotesProducts[3].invoiceSchedule.currentBillingFrequency = 'Quarterly';
        result.quotes = [
          {
            ...defaultQuote,
            quotesProducts,
            quotesContacts: [],
            quoteComments: null,
          },
        ];
        result.company = defaultCompany;
        result.companyAddress = defaultCompanyAddress;
      }
      break;
    case QuotePDFDataType.MoreThanThreeInvoiceSchedules:
      {
        const invoiceSchedules = [
          {
            prices: {
              '10/27/2022': 1250.0,
            },
            paymentDates: ['10/27/2022'],
            defaultFields: {
              currentBillingFrequency: 'Upfront',
            },
            currentBillingFrequency: 'Upfront',
            defaultBillingFrequency: 'Upfront',
          },
          {
            prices: {
              '10/27/2022': 3750.0,
              '11/27/2022': 0,
              '12/28/2022': 0,
              '01/28/2023': 0,
              '02/28/2023': 0,
              '03/31/2023': 0,
              '05/01/2023': 0,
              '06/01/2023': 0,
              '07/02/2023': 0,
              '08/02/2023': 0,
              '09/02/2023': 0,
              '10/03/2023': 0,
              '10/26/2023': 0,
              '10/27/2023': 3750.0,
              '10/26/2024': 3750.0,
              '10/26/2025': 3750.0,
            },
            paymentDates: [
              '10/27/2022',
              '11/27/2022',
              '12/28/2022',
              '01/28/2023',
              '02/28/2023',
              '03/31/2023',
              '05/01/2023',
              '06/01/2023',
              '07/02/2023',
              '08/02/2023',
              '09/02/2023',
              '10/03/2023',
              '10/26/2023',
              '10/27/2023',
              '10/26/2024',
              '10/26/2025',
            ],
            defaultFields: {
              currentBillingFrequency: 'Every 31 Days',
            },
            currentBillingFrequency: 'Annually (Calendar)',
            defaultBillingFrequency: 'Every 31 Days',
          },
        ];

        const quotesProducts = [];
        for (let i = 0; i < defaultQuote.quotesProducts.length; i += 1) {
          const quoteProduct = defaultQuote.quotesProducts[i];

          const index = i % 2;
          quotesProducts.push({
            ...quoteProduct,
            invoiceSchedule: invoiceSchedules[index],
          });
        }
        result.quotes = [
          {
            ...defaultQuote,
            quotesProducts,
          },
        ];
        result.company = defaultCompany;
        result.companyAddress = defaultCompanyAddress;
      }
      break;
    case QuotePDFDataType.HideInvoiceContactUnit:
      result.quotes = [
        {
          ...defaultQuote,
          isExternalHideInvoice: true,
          isExternalHideUnit: true,
          isExternalHideContact: true,
        },
      ];
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      break;
    case QuotePDFDataType.CustomPrimaryColor:
      result.quotes = [defaultQuote];
      result.company = {
        ...defaultCompany,
        settings: {
          customListPriceName: 'List Price',
          customCustomerPriceName: 'Price To Customer',
          companyPrimaryColor: {
            r: 179,
            g: 32,
            b: 243,
            a: 0.94,
          },
        },
      };
      result.companyAddress = defaultCompanyAddress;
      break;
    case QuotePDFDataType.DealTypeChannel:
      result.quotes = [
        {
          ...defaultQuote,
          dealType: 'Channel',
        },
      ];
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      break;
  }

  return result;
}
