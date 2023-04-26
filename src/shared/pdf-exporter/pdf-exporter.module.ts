import { Module } from '@nestjs/common';

import { PDFExporterService } from './pdf-exporter.service';

@Module({
  imports: [],
  providers: [PDFExporterService],
  exports: [PDFExporterService],
  controllers: [],
})
export class PdfExporterModule {}
