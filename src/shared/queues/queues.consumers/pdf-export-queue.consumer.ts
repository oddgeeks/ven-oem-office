import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

import { OemQuotesService } from '../../../oem/main/oem-quotes/oem-quotes.service';
import { OemVendosService } from '../../../oem/main/oem-vendos/oem-vendos.service';
import { QueueNames } from '../queues.enums/queue-enum';

@Processor(QueueNames.PdfExport)
export class PdfExportQueueConsumer {
  private readonly logger = new Logger(PdfExportQueueConsumer.name);

  constructor(
    @InjectConnection('MASTER_CONNECTION')
    private connection: Connection,
    private quotesService: OemQuotesService,
    private vendosService: OemVendosService,
  ) {}

  @Process({
    concurrency: 100,
  })
  async process(job: Job) {
    await job.progress(0);

    try {
      const { manager } = this.connection;
      const { quoteId, vendoId } = job.data;

      let pdfFileUrl = null;
      if (quoteId) {
        pdfFileUrl = await this.quotesService.exportPdf(quoteId, manager);
      } else if (vendoId) {
        pdfFileUrl = await this.vendosService.exportPdf(vendoId, manager);
      }

      await job.update({
        quoteId,
        vendoId,
        pdfFileUrl,
      });

      this.logger.log({
        func: 'PdfExportQueueConsumer/process',
        quoteId,
        vendoId,
        pdfFileUrl,
      });
    } catch (error) {
      this.logger.error({
        func: 'PdfExportQueueConsumer/process',
        error,
      });

      throw error;
    }

    await job.progress(100);
  }
}
