import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Extension,
  ExtensionType,
  IFilenameService,
} from './filename-generator.interface';

@Injectable()
export class FilenameService implements IFilenameService {
  generateRandomName(extension: ExtensionType): string {
    return randomUUID() + '.' + Extension[extension];
  }
}
