/**
 * Export Vendo:
 *
 * company: Company,
 * companyAddress: Address,
 * vendo: {
 *  ...Vendo,
 * },
 * quotes: {
 *  ...Quote,
 *  customer: Customer,
 *  usersQuotes: QuotesUsers[],
 *  geoHierarchy: Hierarchy,
 *  quotesProducts: QuotesProducts[],
 *  quotesContacts: QuotesContacts[]
 * }[]
 *
 * Export Quote:
 *
 * company: Company,
 * companyAddress: Address,
 * quotes: {
 *  ...Quote,
 *  customer: Customer,
 *  usersQuotes: QuotesUsers[],
 *  geoHierarchy: Hierarchy,
 *  quotesProducts: QuotesProducts[],
 *  quotesContacts: QuotesContacts[]
 * }[]
 */

export type PdfData = {
  vendo?: any;
  company: any;
  companyAddress: any;
  quotes: any[];
};
