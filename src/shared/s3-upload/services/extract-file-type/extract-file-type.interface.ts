import { ExtensionType } from '../filename-generator/filename-generator.interface';
import { MimeTypes } from './extract-file-type.service';

export interface IExtractFileType {
  extractFromMimetype(mimeType: MimeTypes): ExtensionType;
}
