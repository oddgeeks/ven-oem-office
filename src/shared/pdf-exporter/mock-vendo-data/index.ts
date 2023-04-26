import {
  defaultCompany,
  defaultCompanyAddress,
  defaultVendo,
  defaultVendoQuotes,
} from './default-vendo';

export enum VendoPDFDataType {
  Default = 'default',
  NoQuotes = 'no-quotes',
}

/**
 * This is an entry point for all mock data
 * We can get data for
 * - "Default Vendo"
 * - "Vendo # of quotes = 7"
 *
 */
export function getVendoPdfData(
  pdfDataType: VendoPDFDataType = VendoPDFDataType.Default,
) {
  const result = {
    vendo: null,
    company: null,
    companyAddress: null,
    quotes: null,
  };

  switch (pdfDataType) {
    case VendoPDFDataType.Default:
      result.vendo = defaultVendo;
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      result.quotes = defaultVendoQuotes;
      break;

    case VendoPDFDataType.NoQuotes:
      result.vendo = defaultVendo;
      result.company = defaultCompany;
      result.companyAddress = defaultCompanyAddress;
      result.quotes = [];
      break;
  }

  return result;
}
