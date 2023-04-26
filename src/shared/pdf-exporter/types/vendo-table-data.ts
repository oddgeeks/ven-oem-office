export type VendoTableData = {
  quoteName: string;
  quoteUuid: string;
  currency: string;
  quoteStatus: string;
  products: any[];
  startDate: {
    value: Date | string;
    formattedValue: string;
  };
  endDate: {
    value: Date | string;
    formattedValue: string;
  };
  oneTimeQty: {
    value: number;
    formattedValue: string;
  };
  subscriptionQty: {
    value: number;
    formattedValue: string;
  };
  consumptionQty: {
    value: number;
    formattedValue: string;
  };
  totalNetCost: {
    value: number;
    formattedValue: string;
  };
};
