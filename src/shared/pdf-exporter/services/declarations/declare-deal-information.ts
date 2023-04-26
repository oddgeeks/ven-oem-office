import * as dayjs from 'dayjs';

import { ExportType, PdfData, CompanyColorsType } from '../../types';
import { AddressTypeEnum } from '../../../../oem/main/oem-addresses/oem-address.enums/address-type.enum';
import { PDFImages } from '../../images';
import { declareAddress } from './declare-address';
import { QuoteStatusEnum } from '../../../../oem/main/oem-quotes/oem-quote.enums/quote-status.enum';

export function declareDealInformation(
  exportType: ExportType,
  documentData: PdfData,
  colors: CompanyColorsType,
) {
  const customer =
    exportType === ExportType.Quote
      ? documentData.quotes[0]?.customer
      : documentData.vendo?.customer;
  if (!customer) {
    return {
      columns: [
        {
          stack:
            exportType === ExportType.Vendo
              ? getVendoDetails(documentData.vendo)
              : getQuoteDetails(documentData.quotes[0]),
        },
      ],
      fontSize: 7,
      color: colors.primaryText,
    };
  }

  const salesStack: any[] = [
    {
      text: 'Sales Invoice To:',
      fontSize: 7,
      bold: true,
    },
    {
      text: customer?.customerName || 'Customer',
      margin: [0, 8, 0, 0],
      fontSize: 8,
      italics: true,
    },
  ];

  if (customer?.logoUrl) {
    salesStack.splice(1, 0, {
      image: PDFImages.CustomerLogo,
      margin: [0, 8, 0, 0],
      fit: [100, 40],
    });
  }

  return {
    columns: [
      {
        stack: salesStack,
      },
      {
        stack: getShipOrBillInformation(customer, AddressTypeEnum.BILLING),
      },
      {
        stack: getShipOrBillInformation(customer, AddressTypeEnum.SHIPPING),
      },
      {
        stack:
          exportType === ExportType.Vendo
            ? getVendoDetails(documentData.vendo)
            : getQuoteDetails(documentData.quotes[0]),
      },
    ],
    fontSize: 7,
    color: colors.primaryText,
  };
}

function _getCustomerAddress(customer: any, addressType: AddressTypeEnum) {
  const addressWithType = customer.customerAddresses
    .map((customerAddr: any) => customerAddr.address)
    .find((addr: any) => addr.addressType === addressType);
  const firstAddress =
    customer.customerAddresses && customer.customerAddresses[0]?.address;

  return addressWithType || firstAddress;
}

function getShipOrBillInformation(customer: any, addressType: AddressTypeEnum) {
  return [
    {
      text: addressType === AddressTypeEnum.SHIPPING ? 'Ship To:' : 'Bill To:',
      fontSize: 7,
      bold: true,
    },
    {
      ...declareAddress(_getCustomerAddress(customer, addressType)),
      margin: [0, 8, 0, 0],
      fontSize: 7,
      bold: true,
    },
    {
      text: [customer.phone || '', '\n', customer.customerEmail || ''],
      fontSize: 7,
      margin: [0, 8, 0, 0],
    },
  ];
}

function getQuoteDetails(quote: any) {
  const { expiresAt, quoteUuid, quoteStatus, usersQuotes } = quote;
  const ownerQuoteUser = usersQuotes?.find(
    (quoteUser: any) => quoteUser.isOwner,
  );
  const ownerUser = ownerQuoteUser?.user;
  const ownerName =
    ownerUser?.firstName && `${ownerUser?.firstName} ${ownerUser?.lastName}`;
  const ownerEmail = ownerUser?.ssoLoginEmail || ownerUser?.notificationEmail;

  const stack = [
    {
      text: [
        'Quote Expiration: ',
        expiresAt ? dayjs(expiresAt).format('MM/DD/YY') : 'NA',
      ],
    },
    {
      text: ['Quote ID: ', quoteUuid],
    },
    {
      columns: [
        {
          text: ['Quote Status: ', ' '],
          width: 'auto',
        },
        {
          text: [
            quoteStatus === QuoteStatusEnum.AUTO_APPROVED
              ? 'Approved'
              : quoteStatus,
          ],
          color: quoteStatus === QuoteStatusEnum.DRAFT ? 'red' : 'black',
          bold: quoteStatus === QuoteStatusEnum.DRAFT,
        },
      ],
    },
  ];

  if (ownerName) {
    stack.push({
      text: ['Quote Owner: ', ownerName],
    });
  }

  if (ownerEmail) {
    stack.push({
      text: ['Email: ', ownerEmail],
    });
  }

  return [
    {
      text: 'Quote Details: ',
      fontSize: 7,
      bold: true,
    },
    {
      stack,
      margin: [0, 8, 0, 0],
    },
  ];
}

function getVendoDetails(vendo: any) {
  const { expiresAt, vendoUuid, vendoStatus, vendosUsers } = vendo;
  const ownerVendoUser = vendosUsers?.find(
    (vendoUser: any) => vendoUser.isOwner,
  );
  const ownerUser = ownerVendoUser?.user;
  const ownerName =
    ownerUser?.firstName && `${ownerUser?.firstName} ${ownerUser?.lastName}`;
  const ownerEmail = ownerUser?.ssoLoginEmail || ownerUser?.notificationEmail;

  const stack = [
    {
      text: [
        'Vendo Expiration: ',
        expiresAt ? dayjs(expiresAt).format('MM/DD/YY') : 'NA',
      ],
    },
    {
      text: ['Vendo ID: ', vendoUuid?.trim()],
    },
    {
      text: ['Vendo Status: ', vendoStatus],
    },
  ];

  if (ownerName) {
    stack.push({
      text: ['Vendo Owner: ', ownerName],
    });
  }

  if (ownerEmail) {
    stack.push({
      text: ['Email: ', ownerEmail],
    });
  }

  return [
    {
      text: 'Vendo Details: ',
      bold: true,
    },
    {
      stack,
      margin: [0, 8, 0, 0],
    },
  ];
}
