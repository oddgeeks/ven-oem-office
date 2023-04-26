import { declareAddress } from './declare-address';
import { PDFImages } from '../../images';

export function declareCompanyInformationSidebar(
  company: any,
  companyAddress: any,
) {
  const {
    logoUrl,
    subdomain,
    websiteUrl,
    companyName,
    companyEmail,
    bankName,
    bankAccountNumber,
    bankRoutingNumber,
  } = company;

  const stack: any[] = logoUrl
    ? [
        {
          image: PDFImages.CompanyLogo,
          fit: [106, 40],
        },
      ]
    : [];

  stack.push(
    {
      text: companyName,
      margin: [0, 18, 0, 0],
      fontSize: 8,
      italics: true,
    },
    {
      ...declareAddress(companyAddress),
      margin: [0, 29, 0, 0],
      fontSize: 7,
      bold: true,
    },
    {
      stack: [
        {
          text: companyAddress.email || companyEmail,
          fontSize: 7,
        },
        {
          text: company.websiteUrl || `https://${subdomain}.vendori.com`,
          fontSize: 7,
        },
      ],
      margin: [0, 24, 0, 0],
    },
    {
      stack: [
        {
          text: 'Seller Bank:',
          fontSize: 7,
          bold: true,
        },
        {
          text: bankName,
          fontSize: 7,
        },
      ],
      margin: [0, 24, 0, 0],
    },
    {
      stack: [
        { text: 'Routing:', bold: true, fontSize: 7 },
        { text: bankRoutingNumber, fontSize: 7 },
      ],
      margin: [0, 6, 0, 0],
    },
    {
      stack: [{ text: 'Account:', bold: true }, { text: bankAccountNumber }],
      margin: [0, 6, 0, 0],
    },
  );

  return {
    columns: [
      {
        stack,
        width: '106',
      },
    ],
  };
}
