import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import {
  ExtractFileType,
  MimeTypes,
} from './services/extract-file-type/extract-file-type.service';
import { IAvatar } from './services/generate-avatar/generate-avatar.interface';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { ApiImplicitBody } from '@nestjs/swagger/dist/decorators/api-implicit-body.decorator';

@ApiTags('Upload')
@Controller()
export class UploadController {
  constructor(
    @Inject(UploadService)
    private readonly appService: UploadService,
  ) {}

  private db: IAvatar = {
    /* 
    _100x100: '',
    _256x256: '',
    _512x512: '',
    _64x64: '',*/
    original: '',
  };

  @Post('/upload/images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file) {
    const extension = new ExtractFileType().extractFromMimetype(
      file.mimetype as MimeTypes,
    );

    const result = await this.appService.createAvatar({
      file: file.buffer,
      height: 200,
      width: 200,
      top: 0,
      left: 0,
      extension,
    });
    this.db = result;

    return {
      data: result,
    };
  }

  @Post('/upload/pdf')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(@UploadedFile() file) {
    const extension = new ExtractFileType().extractFromMimetype(
      file.mimetype as MimeTypes,
    );
    const result = await this.appService.uploadPDF({
      file: file.buffer,
      extension: extension,
    });

    return {
      data: result,
    };
  }
}
