import { QuoteProduct, CompanyColorsType, DealTypeEnum } from '../../types';
import { applyVerticalAlignment } from '../lib/vertical-align';

export function declareQuoteProducts(
  dealType: DealTypeEnum,
  quoteProducts: any[],
  quoteProductTotals: any,
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  const result = {
    layout: {
      hLineWidth: (rowIndex: number, node: any) => {
        if (
          rowIndex === node.table.body.length - 3 ||
          rowIndex === node.table.body.length - 2
        ) {
          return 1;
        }

        return 0;
      },
      hLineColor: (rowIndex: number, node: any) => {
        if (rowIndex === node.table.body.length - 3) {
          return colors.primary;
        }

        if (rowIndex === node.table.body.length - 2) {
          return '#DFDFDF';
        }

        return '#fff';
      },
      vLineWidth: () => 0.5,
      vLineColor: () => colors.primary,
      fillColor: (rowIndex: number, node: any) => {
        if (
          rowIndex === node.table.body.length - 3 ||
          rowIndex === node.table.body.length - 2 ||
          rowIndex === node.table.body.length - 1
        ) {
          return null;
        }

        return rowIndex % 2 === 0 ? colors.secondary : null;
      },
      fillOpacity: 0.7,
      paddingLeft: () => 8,
      paddingBottom: (rowIndex: number, node: any) => {
        if (
          rowIndex === node.table.body.length - 2 ||
          rowIndex === node.table.body.length - 1
        ) {
          return 2;
        }

        return 5;
      },
      paddingTop: (rowIndex: number, node: any) => {
        // Apply vertical alignment to the first row
        if (rowIndex !== 0) {
          applyVerticalAlignment(node, rowIndex, 'center');

          if (
            rowIndex === node.table.body.length - 2 ||
            rowIndex === node.table.body.length - 1
          ) {
            return 2;
          }

          return 5;
        }

        applyVerticalAlignment(node, rowIndex, 'bottom');

        return 5;
      },
      defaultBorder: false,
    },
    table: {
      // headers are automatically repeated if the table spans over multiple pages
      // you can declare how many rows should be treated as headers
      headerRows: 1,
      widths: ['*', 34, 32, 32, 30, 56, 30, 56],
      body: [
        [
          {
            text: 'Product Name',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Trans. Type',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Start Date',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'End Date',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Qty.',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'List Price',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Total Customer Discounts',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Customer Price',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
        ],
      ],
    },
    style: 'quoteTable',
  };

  if (dealType === DealTypeEnum.CHANNEL) {
    result.table.widths.push(30, 56);

    result.table.body[0].push(
      {
        text: 'Total Channel Discounts',
        style: 'quoteTableHeader',
        border: [false, false, true, false],
      },
      {
        text: 'Net Price',
        style: 'quoteTableHeader',
        border: [false, false, true, false],
      },
    );
  }

  quoteProducts.forEach((quoteProduct) => {
    result.table.body.push(getQuoteProduct(dealType, quoteProduct) as any);
  });

  result.table.body.push(...(getTotals(dealType, quoteProductTotals) as any));

  return result;
}

function getTotals(dealType: DealTypeEnum, quoteProductTotals: any) {
  const total = [
    {
      text: 'Total',
      bold: true,
      border: [false, true, false, true],
      fontSize: 6,
    },
    { text: '', border: [false, true, false, true] },
    { text: '', border: [false, true, false, true] },
    { text: '', border: [false, true, false, true] },
    {
      text: quoteProductTotals.quantity,
      bold: true,
      fontSize: 6,
      border: [false, true, false, true],
    },
    { text: '', border: [false, true, false, true] },
    { text: '', border: [false, true, false, true] },
    {
      text: quoteProductTotals.customerPrice,
      bold: true,
      fontSize: 6,
      border: [false, true, false, true],
    },
  ];
  if (dealType === DealTypeEnum.CHANNEL) {
    total.push(
      {
        text: '',
        border: [false, true, false, true],
      },
      {
        text: quoteProductTotals.netPrice,
        bold: true,
        border: [false, true, false, true],
      } as any,
    );
  }

  const tax = [
    '',
    '',
    '',
    '',
    '',
    { text: 'Tax', fontSize: 6 },
    '',
    { text: '$0', fontSize: 6 },
  ];
  if (dealType === DealTypeEnum.CHANNEL) {
    tax.unshift('', '');
  }

  const grandTotal = [
    '',
    '',
    '',
    '',
    '',
    { text: 'Grand Total', bold: true, fontSize: 6 },
    '',
    {
      text:
        dealType === DealTypeEnum.CHANNEL
          ? quoteProductTotals.netPrice
          : quoteProductTotals.customerPrice,
      bold: true,
      fontSize: 6,
    },
  ];
  if (dealType === DealTypeEnum.CHANNEL) {
    grandTotal.unshift('', '');
  }

  const totals = [total, tax, grandTotal];

  return totals;
}

function getQuoteProduct(dealType: DealTypeEnum, quoteProduct: QuoteProduct) {
  const product = [
    quoteProduct.productName,
    quoteProduct.transactionType,
    quoteProduct.startDate.formattedValue,
    quoteProduct.endDate.formattedValue,
    quoteProduct.quantity.formattedValue,
    quoteProduct.listPrice.formattedValue,
    quoteProduct.totalCustomerDiscount.formattedValue,
    quoteProduct.customerPrice.formattedValue,
  ];

  if (dealType === DealTypeEnum.CHANNEL) {
    product.push(
      quoteProduct.totalChannelDiscount.formattedValue,
      quoteProduct.netPrice.formattedValue,
    );
  }

  return product;
}
