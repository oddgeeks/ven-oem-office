import { Module } from '@nestjs/common';
import request = require('superagent');
import { PDFDocument } from 'pdf-lib';

import { PdfMergerService } from './pdf-merger.service';

@Module({
  imports: [],
  providers: [
    { provide: request, useValue: request },
    {
      provide: PDFDocument,
      useValue: PDFDocument,
    },
    PdfMergerService,
  ],
  exports: [
    PdfMergerService,
    { provide: request, useValue: request },
    { provide: PDFDocument, useValue: PDFDocument },
  ],
  controllers: [],
})
export class PdfMergerModule {}
