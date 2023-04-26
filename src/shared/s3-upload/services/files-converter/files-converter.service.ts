import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';
import { Injectable } from '@nestjs/common';
import { Duplex, Readable } from 'stream';
import { IFilesConverter } from './files-converter.interface';

@Injectable()
export class FilesConverterService implements IFilesConverter {
  async fileToStream(file): Promise<NodeJS.ReadableStream> {
    const stream = new Duplex();
    stream.push(file.buffer);
    stream.push(null);
    return stream;
  }

  async bufferToStream(file: Buffer): Promise<NodeJS.ReadableStream> {
    return Readable.from(file);
  }

  async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return streamToBuffer(stream);
  }
}
