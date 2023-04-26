import { BadRequestException } from '@nestjs/common';
import { ExtensionType } from '../filename-generator/filename-generator.interface';
import { IExtractFileType } from './extract-file-type.interface';

export type MimeTypes =
  | 'image/png'
  | 'image/jpeg'
  | 'image/bmp'
  | 'image/gif'
  | 'application/pdf';

const validMimeType = [
  'image/png',
  'image/jpeg',
  'image/bmp',
  'image/gif',
  'application/pdf',
];

export class ExtractFileType implements IExtractFileType {
  extractFromMimetype(mimeType: MimeTypes): ExtensionType {
    const isValid = validMimeType.indexOf(mimeType);

    if (isValid === -1) {
      throw new BadRequestException(`${mimeType} is not valid format`);
    }

    switch (mimeType) {
      case 'image/bmp':
        return 'BMP';

      case 'image/gif':
        return 'GIF';

      case 'image/jpeg':
        return 'JPEG';

      case 'image/png':
        return 'PNG';

      case 'application/pdf':
        return 'PDF';

      default:
        throw new BadRequestException(`${mimeType} is not valid format`);
    }
  }
}
