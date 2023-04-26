import { createReadStream, writeFileSync } from 'fs';
import { ImageService } from '../crop-image.service';
import { join } from 'path';
import { FilesConverterService } from '../../files-converter/files-converter.service';

describe('crop-image.service', () => {
  const imgService: ImageService = new ImageService();
  const converter = new FilesConverterService();

  it('should crop an image', async () => {
    const readPath = __dirname + join('/image.jpeg');
    const writePath = __dirname + join('/result.png');

    const stream = createReadStream(readPath);
    const file = await converter.streamToBuffer(stream);

    const result = await imgService.cropAndResizeFromBuffer({
      file,
      cropPositions: {
        width: 200,
        height: 200,
        top: 200,
        left: 200,
      },
      resize: {
        width: 70,
      },
    });

    writeFileSync(writePath, result);

    expect(result).toBeTruthy();
  });
});
