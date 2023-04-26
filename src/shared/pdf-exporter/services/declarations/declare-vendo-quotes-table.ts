import { vendoChartColors } from '../../constants';
import { VendoTableData, CompanyColorsType } from '../../types';
import { applyVerticalAlignment } from '../lib/vertical-align';

export function declareVendoQuotes(quotes: any[], colors: CompanyColorsType) {
  const result = {
    layout: {
      hLineWidth: (rowIndex: number, node: any) => {
        if (rowIndex === node.table.body.length) return 1;

        return 0;
      },
      hLineColor: (rowIndex: number, node: any) => {
        if (rowIndex === node.table.body.length) {
          return colors.primary;
        }

        return '#fff';
      },
      vLineWidth: () => 0.5,
      vLineColor: () => colors.primary,
      fillColor: (rowIndex: number) =>
        rowIndex % 2 === 0 ? colors.secondary : null,
      fillOpacity: 0.7,
      paddingLeft: () => 8,
      paddingBottom: () => 5,
      paddingTop: (rowIndex: number, node: any) => {
        // Apply vertical alignment to the first row
        if (rowIndex !== 0) {
          applyVerticalAlignment(node, rowIndex, 'center');

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
      widths: ['*', 52, 32, 48, 32, 32, 32, 42, 36, 38, 56],
      body: [
        [
          {
            text: '',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Quote ID',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Currency',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Quote Status',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Products (Qty.)',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Start Date (earliest)',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'End Date (latest)',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Total One-Time Qty.',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Total Subscription Qty.',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Total Consumption Qty.',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
          {
            text: 'Total Net Cost',
            style: 'quoteTableHeader',
            border: [false, false, true, false],
          },
        ],
      ],
    },
    style: 'quoteTable',
  };

  quotes.forEach((quote, index) => {
    result.table.body.push(getQuoteItem(quote, index) as any);
  });

  return result;
}

function getQuoteItem(quote: VendoTableData, index: number) {
  return [
    {
      columns: [
        {
          width: 14,
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 8,
              h: 8,
              color: vendoChartColors[index].hex(),
            },
          ],
        },
        {
          text: quote.quoteName,
          bold: true,
        },
      ],

      border: [false, false, false, true],
      columnGap: 0,
    },
    {
      border: [false, false, false, true],
      text: quote.quoteUuid,
    },
    {
      border: [false, false, false, true],
      text: quote.currency,
    },
    {
      border: [false, false, false, true],
      text: quote.quoteStatus,
    },
    {
      border: [false, false, false, true],
      text: quote.products.length,
    },
    {
      border: [false, false, false, true],
      text: quote.startDate.formattedValue,
    },
    {
      border: [false, false, false, true],
      text: quote.endDate.formattedValue,
    },
    {
      border: [false, false, false, true],
      text: quote.oneTimeQty.formattedValue,
    },
    {
      border: [false, false, false, true],
      text: quote.subscriptionQty.formattedValue,
    },
    {
      border: [false, false, false, true],
      text: quote.consumptionQty.formattedValue,
    },
    {
      bold: true,
      border: [false, false, false, true],
      text: quote.totalNetCost.formattedValue,
    },
  ];
}
