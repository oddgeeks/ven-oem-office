import { Injectable, Logger } from '@nestjs/common';
import MemoryStream = require('memorystream');
import PdfPrinter = require('pdfmake');
import * as path from 'path';
import * as Color from 'color';
import { Buffer } from 'buffer';

import { PDFImages } from './images';

import { getBase64FromUrl } from './services/lib/file-reader';
import {
  ANNUAL_COST_NET_PRICE,
  COMMENTS,
  UNIT_ECONOMICS_NET_PRICE,
} from './constants';
import {
  buildAnnualSummarySeries,
  buildUnitEconomicsSeries,
  declareBackgroundImage,
  drawChart,
  declareComment,
  declareCompanyInformationSidebar,
  declareContacts,
  declareDealInformation,
  declareInvoiceSchedule,
  drawLegend,
  declareQuoteProducts,
  declareVendoQuotes,
  transformChartProducts,
  calculateQuoteProductTotals,
  transformQuoteProducts,
  transformQuoteProductTotals,
  transformInvoiceSchedule,
  transformVendoQuotes,
  transformChartQuotes,
  buildQuotesCostSeries,
  drawVendoChart,
  calculateInvoiceScheduleLabels,
  buildTableRows,
  gatherProductsWithBundles,
} from './services';

import { ExportType, PdfData, CompanyColorsType } from './types';
import { QuoteStatusEnum } from '../../oem/main/oem-quotes/oem-quote.enums/quote-status.enum';

interface IPDFExporterDocConfigData {
  pageSize: 'LETTER';
  pageOrientation: 'landscape' | 'portrait';
  pageMargins: [number, number, number, number];
  defaultStyle: {
    color: string;
    font: 'Inter';
  };
}

interface IPDFPageSize {
  height: number;
  width: number;
}

@Injectable()
//TODO: Logger should be injected
export class PDFExporterService {
  private readonly logger = new Logger(PDFExporterService.name);
  private exportType: ExportType;
  private colors: CompanyColorsType = {
    primaryText: Color('#152C46').hex(),
    primary: Color('#4A89BB').hex(),
    secondary: Color('#EBF0F6').hex(),
  };

  private readonly _DEFAULT_DOC_DATA: IPDFExporterDocConfigData = {
    pageSize: 'LETTER',
    pageOrientation: 'landscape',
    pageMargins: [160, 63, 36, 63],
    defaultStyle: {
      color: this.colors.primaryText,
      font: 'Inter',
    },
  };

  private readonly _DEFAULT_DOC_FONTS = {
    Inter: {
      normal: path.resolve(
        process.cwd(),
        './src/shared/pdf-exporter/fonts/Inter-Regular.ttf',
      ),
      bold: path.resolve(
        process.cwd(),
        './src/shared/pdf-exporter/fonts/Inter-SemiBold.ttf',
      ),
      italics: path.resolve(
        process.cwd(),
        './src/shared/pdf-exporter/fonts/Inter-Medium.ttf',
      ),
      bolditalics: path.resolve(
        process.cwd(),
        './src/shared/pdf-exporter/fonts/Inter-Medium.ttf',
      ),
    },
  };

  private _declareSidebar(pageSize: IPDFPageSize, documentData: PdfData) {
    return {
      stack: [
        declareCompanyInformationSidebar(
          documentData.company,
          documentData.companyAddress,
        ),
      ],
      margin: [35, -pageSize.height + 85, 0, 0],
      fontSize: 7,
    };
  }

  private _declareBackground(
    currentPage: number,
    pageSize: IPDFPageSize,
    documentData: PdfData,
  ) {
    const isEvenPage = currentPage % 2 === 0;

    return [
      declareBackgroundImage(pageSize, isEvenPage, this.colors),
      this._declareSidebar(pageSize, documentData),
    ];
  }

  private _declareFooter(currentPage: number, pageCount: number) {
    const isEvenPage = currentPage % 2 === 0;

    return {
      columns: [
        '',
        {
          text: `Page ${currentPage}/${pageCount}`,
          alignment: 'right',
          color: isEvenPage ? this.colors.primaryText : '#FFF',
          fontSize: 8,
          font: 'Inter',
          bold: true,
          margin: [0, 30, 25, 0],
        },
      ],
    };
  }

  private _declareVendoQuotes(documentData: PdfData) {
    // Transform the quotes into a format that pdfmake can use
    const transformedQuotes = transformVendoQuotes(documentData.quotes);

    return declareVendoQuotes(transformedQuotes, this.colors);
  }

  private _declareVendoCharts(documentData: PdfData) {
    if (!documentData.quotes?.length) {
      return {};
    }

    const transformedQuotes = transformVendoQuotes(documentData.quotes);

    const transformedChartQuotes = transformChartQuotes(transformedQuotes);

    const quotesCostSeries = buildQuotesCostSeries(transformedChartQuotes);

    return {
      columns: [
        {
          width: 595,
          margin: [0, 15, 0, 0],
          ...drawVendoChart(
            quotesCostSeries.xAxisLabels,
            quotesCostSeries.series,
            this.colors,
          ),
        },
      ],
    };
  }

  /**
   * Transforms the quote products into a format that pdfmake can use and appends bundles if needed.
   * And calculate the totals.
   */
  private _declareQuoteProductsTable(quote: any) {
    const { dealType, quotesProducts } = quote;

    const transformedQuoteProductsWithBundles =
      gatherProductsWithBundles(quotesProducts);

    const transformedQuoteProducts = transformQuoteProducts(quotesProducts);
    const quoteProductTotals = calculateQuoteProductTotals(
      transformedQuoteProducts,
    );
    const transformedQuoteProductTotals =
      transformQuoteProductTotals(quoteProductTotals);

    return declareQuoteProducts(
      dealType,
      transformedQuoteProductsWithBundles,
      transformedQuoteProductTotals,
      this.colors,
    );
  }

  private _pageBreakBefore(
    currentNode: any,
    followingNodesOnPage: any[],
    nodesOnNextPage: any[],
    previousNodesOnPage: any[],
  ) {
    const { startPosition } = currentNode;
    const { verticalRatio } = startPosition;
    if (
      [
        'quoteCommentsLarge',
        'vendoCommentsLarge',
        'quoteContactsLarge',
        'invoiceScheduleLarge',
      ].includes(currentNode.style)
    ) {
      return nodesOnNextPage.length > 0 && verticalRatio > 0.8;
    } else if (currentNode.style === 'quoteProductsChartsLarge') {
      return nodesOnNextPage.length > 0 && verticalRatio > 0.6;
    }
    return false;
  }

  private _declareComments(
    comments: string,
    additionalOptions = {},
    size: 'sm' | 'lg' = 'lg',
  ) {
    if (!comments?.length) {
      return {};
    }

    return {
      ...declareComment(comments, COMMENTS, this.colors, size),
      ...additionalOptions,
    };
  }

  private _declareContacts(
    {
      isExternalHideContact = false,
      contacts,
    }: {
      isExternalHideContact?: boolean;
      contacts: any[];
    },
    additionalOptions = {},
    size: 'sm' | 'lg' = 'lg',
  ) {
    if (isExternalHideContact || !contacts?.length) {
      return {};
    }

    return {
      ...declareContacts(
        contacts.map((c) => c.contact),
        this.colors,
        size,
      ),
      ...additionalOptions,
    };
  }

  private _declareInvoiceScheduleTable(
    quote: any,
    additionalOptions = {},
    size: 'sm' | 'lg' = 'lg',
  ) {
    const { isExternalHideInvoice, quotesProducts } = quote;
    if (isExternalHideInvoice) {
      return {};
    }

    const transformedInvoiceScheduleProducts =
      transformInvoiceSchedule(quotesProducts);
    const invoiceScheduleLabels = calculateInvoiceScheduleLabels(
      transformedInvoiceScheduleProducts,
    );

    const invoiceScheduleTableRows = buildTableRows(
      transformedInvoiceScheduleProducts,
      invoiceScheduleLabels,
    );

    return {
      ...declareInvoiceSchedule(
        transformedInvoiceScheduleProducts,
        invoiceScheduleTableRows,
        this.colors,
        size,
      ),
      ...additionalOptions,
    };
  }

  /**
   * Draw charts for the unit economics and annual summary sections
   * This chart can be in two sizes: small (without the legend) and large (with the legend)
   */
  private _declareCharts(
    quote: any,
    additionalOptions = {},
    size: 'sm' | 'lg' = 'lg',
  ) {
    const { dealType, isExternalHideUnit, quotesProducts } = quote;
    if (!quotesProducts?.length) {
      return {};
    }

    const transformedQuoteProducts = transformChartProducts(
      dealType,
      quotesProducts,
    );

    const annualSummarySeries = buildAnnualSummarySeries(
      transformedQuoteProducts,
    );

    const unitEconomicsSeries = buildUnitEconomicsSeries(
      transformedQuoteProducts,
    );

    const columns = [];
    const chartWidth = size === 'lg' ? 230 : 140;

    if (size === 'lg')
      columns.push({
        width: 106,
        ...drawLegend(transformedQuoteProducts),
      });

    columns.push({
      width: chartWidth,
      ...drawChart(
        ANNUAL_COST_NET_PRICE,
        annualSummarySeries.xAxisLabels,
        annualSummarySeries.series,
        chartWidth,
        this.colors,
        size,
      ),
    });

    if (!isExternalHideUnit) {
      columns.push({
        width: chartWidth,
        ...drawChart(
          UNIT_ECONOMICS_NET_PRICE,
          unitEconomicsSeries.xAxisLabels,
          unitEconomicsSeries.series,
          chartWidth,
          this.colors,
          size,
        ),
      });
    }

    return {
      columns,
      columnGap: 15,
      margin: size === 'lg' ? [0, 20, 0, 4] : [0, 0, 0, 4],
      ...additionalOptions,
    };
  }

  private _declareVendoInformation(documentData: PdfData) {
    return [
      declareDealInformation(ExportType.Vendo, documentData, this.colors),
      this._declareVendoQuotes(documentData),
      this._declareVendoCharts(documentData),
      this._declareComments(documentData.vendo?.vendoComments, {
        style: 'vendoCommentsLarge',
      }),
      this._declareContacts({ contacts: documentData.vendo?.vendosContacts }),
    ];
  }

  private _declareQuoteInformation(documentData: PdfData) {
    const result = [];

    documentData.quotes.forEach((quote) => {
      const { quotesContacts, quotesProducts, isExternalHideContact } = quote;

      result.push(
        {
          ...declareDealInformation(
            ExportType.Quote,
            documentData,
            this.colors,
          ),
          ...(this.exportType === ExportType.Vendo && { pageBreak: 'before' }),
        },
        this._declareQuoteProductsTable(quote),
      );

      // We are drawing different layouts for the table with <= 3 quote products and > 3 quote products
      if (quotesProducts.length <= 3) {
        result.push(
          {
            columns: [
              this._declareCharts(quote, {}, 'sm'),
              {
                stack: [
                  this._declareInvoiceScheduleTable(quote, {}, 'sm'),
                  this._declareComments(
                    quote.quoteComments,
                    {
                      margin: [0, 0, 10, 0],
                    },
                    'sm',
                  ),
                ],
              },
            ],
            columnGap: 15,
            margin: [0, 5, 0, 0],
          },
          this._declareContacts(
            { contacts: quotesContacts, isExternalHideContact },
            {},
            'sm',
          ),
        );
      } else {
        result.push(
          this._declareComments(quote.quoteComments, {
            style: 'quoteCommentsLarge',
          }),
          this._declareContacts(
            { contacts: quotesContacts, isExternalHideContact },
            {
              style: 'quoteContactsLarge',
            },
          ),
          this._declareInvoiceScheduleTable(quote, {
            style: 'invoiceScheduleLarge',
          }),
          this._declareCharts(quote, {
            style: 'quoteProductsChartsLarge',
          }),
        );
      }
    });

    return result;
  }

  private async _getImages(documentData: PdfData) {
    try {
      const companyLogo =
        documentData.company.logoUrl &&
        (await getBase64FromUrl(documentData.company.logoUrl));
      const customer =
        this.exportType === ExportType.Quote
          ? documentData.quotes[0]?.customer
          : documentData.vendo?.customer;
      const customerLogo = customer?.logoUrl
        ? await getBase64FromUrl(customer.logoUrl)
        : companyLogo;

      const images = {
        [PDFImages.CompanyLogo]: companyLogo,
        [PDFImages.CustomerLogo]: customerLogo,
      };

      return images;
    } catch (err) {
      this.logger.error({
        func: '_getImages',
        err,
      });

      return {};
    }
  }

  /**
   * Checks if there is at least one quote with given `criteria`.
   */
  private _isAtLeastOneQuoteWithCriteria(
    documentData: PdfData,
    criteria: QuoteStatusEnum,
  ) {
    return documentData.quotes.some((quote) => quote.quoteStatus === criteria);
  }

  private _initCompanyColors(company: any) {
    const { settings } = company;
    if (settings?.companyPrimaryColor) {
      const { r, g, b, a } = settings.companyPrimaryColor;
      this.colors.primary = Color.rgb(r, g, b).alpha(a).hex();
    }
  }

  /**
   * Builds watermark object based on quote status.
   */
  private _determineAndBuildWatermark(documentData: PdfData) {
    const watermarkObject = {
      color: 'red',
      opacity: 0.1,
    };

    if (
      this._isAtLeastOneQuoteWithCriteria(
        documentData,
        QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
      )
    ) {
      return {
        ...watermarkObject,
        text: 'Pending quote - for internal use and visibility only. This text will disappear when the quote is approved and ready for external distribution.',
      };
    }

    if (
      this._isAtLeastOneQuoteWithCriteria(documentData, QuoteStatusEnum.DRAFT)
    ) {
      return {
        ...watermarkObject,
        text: 'Draft Quote - Pending Internal Approval',
      };
    }

    return undefined;
  }

  async generatePDF(
    exportType: ExportType,
    documentData: PdfData,
  ): Promise<Buffer> {
    this.exportType = exportType;
    this._initCompanyColors(documentData.company);

    const images = await this._getImages(documentData);

    const documentDefinition: any = {
      ...this._DEFAULT_DOC_DATA,
      background: (currentPage: number, pageSize: IPDFPageSize) =>
        this._declareBackground(currentPage, pageSize, documentData),
      footer: this._declareFooter.bind(this),
      watermark: this._determineAndBuildWatermark(documentData),
      content: [
        ...(this.exportType === ExportType.Vendo
          ? this._declareVendoInformation(documentData)
          : []),
        ...this._declareQuoteInformation(documentData),
      ],
      pageBreakBefore: this._pageBreakBefore,
      images,
      styles: {
        quoteTableHeader: {
          bold: true,
          fontSize: 6,
          color: 'white',
          fillColor: this.colors.primary,
          fillOpacity: 1,
        },
        quoteTable: {
          fontSize: 6,
          color: this.colors.primaryText,
          margin: [0, 10, 0, 0],
        },
        invoiceScheduleTable: {
          fontSize: 7,
          color: this.colors.primaryText,
        },
        contactCard: {
          fillColor: this.colors.secondary,
          fillOpacity: 0.7,
          fontSize: 7,
          margin: [8, 8, 8, 8],
        },
        contactCardSmall: {
          fillColor: this.colors.secondary,
          fillOpacity: 0.7,
          fontSize: 6,
          margin: [4, 4, 4, 4],
        },
        quoteContactsLarge: {
          margin: [0, 0, 0, 40],
        },
      },
    };

    const printer = new PdfPrinter(this._DEFAULT_DOC_FONTS);

    const pdfDoc = printer.createPdfKitDocument(documentDefinition);

    // Create a stream to hold the PDF in memory
    const memStream = new MemoryStream(null, {
      readable: false,
    });

    // Write the PDF to the stream
    pdfDoc.pipe(memStream);

    // When the PDF is done being written to the stream, resolve the promise
    return new Promise((resolve) => {
      memStream.on('finish', () => {
        // Get the buffer from the stream
        const buffer = memStream.toBuffer();

        // Resolve the promise with the buffer
        resolve(buffer);
      });

      pdfDoc.end();
    });
  }
}
