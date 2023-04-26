import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { PdfMergerService } from './pdf-merger.service';
import { Readable } from 'stream';
import { Response } from 'express';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller()
export class PdfMergerController {
  constructor(
    @Inject(PdfMergerService)
    private readonly pdfMergerService: PdfMergerService,
  ) {}

  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  @ApiQuery({
    name: 'PDFUrls',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  @ApiOkResponse({
    description: 'Pdf merged',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Get('/pdf-merger-test')
  async mergePdf(@Res() res: Response, @Query() query) {
    console.log(query.PDFUrls);
    const pdfMergeBuffer = await this.pdfMergerService.downloadAndMerge(
      query.PDFUrls,
    );
    const stream = this.getReadableStream(pdfMergeBuffer);

    res.set({
      'Content-Type': 'application/pdf; multipart/form-data',
      'Content-Disposition': 'attachment; filename=export.pdf',
      'Content-Length': pdfMergeBuffer.length,
    });
    stream.pipe(res);
  }
}
