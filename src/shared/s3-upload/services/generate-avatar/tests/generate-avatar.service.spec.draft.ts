import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ImageService } from '../../crop-image/crop-image.service';
import { FilenameService } from '../../filename-generator/filename-generator.service';
import { FilesConverterService } from '../../files-converter/files-converter.service';
import { UploaderService } from '../../uploader/uploader.service';
import { IAvatarService } from '../generate-avatar.interface';
import { GenerateAvatarService } from '../generate-avatar.service';

describe('generate-avatar.service', () => {
  let fakeS3: S3;
  let service: IAvatarService;
  let readPath: string;
  let file: Buffer;

  beforeAll(async () => {
    const converter = new FilesConverterService();
    readPath = __dirname + join('/image.jpeg');
    const stream = createReadStream(readPath);
    file = await converter.streamToBuffer(stream);
  });

  beforeEach(() => {
    jest.setTimeout(99999);

    fakeS3 = {
      getSignedUrlPromise: jest.fn(() => 'https://aws.bucket/random'),
      putObject: jest.fn(() => {}),
    } as unknown as S3;

    service = new GenerateAvatarService(
      new ImageService(),
      new UploaderService(fakeS3),
      new FilenameService(),
      'bucket_name_test',
    );
  });

  it('should generate a valid avatar', async () => {
    const result = await service.create({
      cropPositions: {
        height: 200,
        left: 200,
        top: 200,
        width: 200,
      },
      extension: 'JPEG',
      userId: randomUUID(),
      file,
    });

    expect(result).toBeTruthy();
  });
});
