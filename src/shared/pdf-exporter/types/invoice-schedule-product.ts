export type InvoiceScheduleProduct = {
  productName: string;
  billingFrequency: string;
  totalProductPrice: {
    label: string;
    value: number;
    formattedValue: string;
  };
  prices: Record<
    string,
    {
      value: number;
      formattedValue: string;
    }
  >;
};
