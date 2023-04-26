import { Inject, Injectable } from '@nestjs/common';
import { PDFDocument, PDFPage } from 'pdf-lib';
import request = require('superagent');

import { PDFDocumentWithStaticMethods } from './pdf-merger.types/pdf-merger.type';

@Injectable()
export class PdfMergerService {
  constructor(
    @Inject(request)
    private readonly request: request.SuperAgent<any>,
    @Inject(PDFDocument)
    private readonly PDFDocumentLibrary: PDFDocumentWithStaticMethods,
  ) {}

  /**
   * Downloads file with given `urlFile`, then checks it to be PDF.
   */
  private async _getFile(urlFile: string): Promise<Buffer> {
    const res = await this.request
      .get(urlFile)
      .set('Accept', 'application/pdf')
      .buffer(true)
      .parse(request.parse.pdf);

    if (res.headers['content-type'].indexOf('application/pdf') == -1) {
      throw new Error('The file is not pdf.');
    }

    return res && res._body;
  }

  /**
   * Resizes given other page according to `Vendori` page proportions.
   */
  private async _resizePageProportionalTo(
    vendoriPDFPage: PDFPage,
    otherPage: PDFPage,
  ) {
    const vendoriPageSize = vendoriPDFPage.getSize();
    const otherPageSize = otherPage.getSize();

    let scale = 1;

    if (vendoriPageSize.width < otherPageSize.width) {
      if (vendoriPageSize.height < otherPageSize.height) {
        scale = vendoriPageSize.height / otherPageSize.height;
      } else {
        scale = vendoriPageSize.width / otherPageSize.width;
      }
    }

    if (vendoriPageSize.width > otherPageSize.width) {
      if (vendoriPageSize.height > otherPageSize.height) {
        scale = vendoriPageSize.width / otherPageSize.width;
      } else {
        scale = vendoriPageSize.height / otherPageSize.height;
      }
    }

    otherPage.scale(scale, scale);
    otherPage.setSize(vendoriPageSize.width, vendoriPageSize.height);

    return otherPage;
  }

  /**
   * Converts given `arrayBuffer` to buffer.
   */
  private _convertArrayBufferToBuffer(arrayBuffer: ArrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }

    return buffer;
  }

  /**
   * Takes `files` array buffer and converts it to `PDFDocument`s array.
   */
  private async _convertToPDFDocuments(
    files: Array<Buffer>,
  ): Promise<PDFDocument[]> {
    const pdfs = [];

    for (const file of files) {
      const pdf = await PDFDocument.load(file);
      pdfs.push(pdf);
    }

    return pdfs;
  }

  /**
   * Creates empty pdf file, then converts files to pdf documents.
   * After checks if Vendori PDF file present, then proportionally resizes all pages per Vendori file size.
   */
  public async merge(files: Array<Buffer>, relationalIndex?: number) {
    if (!files.length) {
      return null;
    }

    const newFile = await this.PDFDocumentLibrary.create();
    const pdfs = await this._convertToPDFDocuments(files);

    for (const pdfFile of pdfs) {
      const pages = await newFile.copyPages(pdfFile, pdfFile.getPageIndices());

      for (let page of pages) {
        if (relationalIndex >= 0) {
          const vendoriFile = pdfs[relationalIndex];

          const [vendoriPage] = await newFile.copyPages(
            vendoriFile,
            vendoriFile.getPageIndices(),
          );

          page = await this._resizePageProportionalTo(vendoriPage, page);
          console.log(page.getSize());
        }

        newFile.addPage(page);
      }
    }

    const result = await newFile.save();

    return this._convertArrayBufferToBuffer(result.buffer);
  }

  /**
   * Checks if there are `fileLinks`, then gets them, and passes to merger.
   */
  public async downloadAndMerge(fileLinks: string[]): Promise<Buffer> {
    if (!fileLinks?.length) {
      return null;
    }

    const files: Array<Buffer> = [];
    for (let i = 0; i < fileLinks.length; i++) {
      files.push(await this._getFile(fileLinks[i]));
    }

    const mergedFile = await this.merge(files);

    return mergedFile;
  }
}
