import { createReadStream, existsSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { FilesConverterService } from '../files-converter.service';

describe('files-converter.service', () => {
  let readPath: string;
  let resultPath: string;
  let file: NodeJS.ReadableStream;

  beforeAll(async () => {
    readPath = __dirname + join('/image.jpeg');
    resultPath = __dirname + join('/result.jpeg');
    const existsFile = existsSync(resultPath);
    if (existsFile) {
      unlinkSync(resultPath);
    }
    file = createReadStream(readPath);
  });

  it('should convert buffer to stream and turn back', async () => {
    const fileConverter = new FilesConverterService();
    const result = await fileConverter.streamToBuffer(file);
    const res = await fileConverter.bufferToStream(result);
    const finalFile = await fileConverter.streamToBuffer(res);

    writeFileSync(resultPath, finalFile);
  });
});
