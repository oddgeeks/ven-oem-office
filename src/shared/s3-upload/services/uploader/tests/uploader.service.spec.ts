import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FilesConverterService } from '../../files-converter/files-converter.service';
import { UploadParam } from '../get-signed-url-param.interface';
import { UploaderService } from '../uploader.service';

describe('uploader.service', () => {
  let fakeS3: S3;
  let readPath: string;
  let file: Buffer;
  const converter = new FilesConverterService();

  beforeAll(async () => {
    readPath = __dirname + join('/image.jpeg');
    const stream = createReadStream(readPath);
    file = await converter.streamToBuffer(stream);
  });

  beforeEach(() => {
    fakeS3 = {
      getSignedUrlPromise: jest.fn(),
      upload: jest.fn(),
      putObject: jest.fn(),
    } as unknown as S3;
  });

  it('should be defined', () => {
    const service = new UploaderService(fakeS3);
    expect(service).toBeDefined();
  });

  it('should call get pre-signed url ', async () => {
    const fakeUrl = 'https://aws.s3/bucket-fake/fake-image.jpeg';

    jest.spyOn(fakeS3, 'getSignedUrlPromise').mockResolvedValueOnce(fakeUrl);

    const service = new UploaderService(fakeS3);

    const result = await service.getSignUrl({
      Bucket: 'valid_bucket_name',
      ContentType: 'JPEG',
      Key: 'filename.jpeg',
    });

    expect(result).toBe(fakeUrl);
  });

  it('should call put pre-signed url ', async () => {
    //const fakeUrl = 'https://aws.s3/bucket-fake/fake-image.jpeg';
    const params: UploadParam = {
      Bucket: 'valid_bucket_name',
      ContentType: 'JPEG',
      Key: 'filename.jpeg',
      Body: file,
      Expires: new Date(),
    };

    const service = new UploaderService(fakeS3);
    const s3Spy = jest.spyOn(service, 'putObject').mockResolvedValueOnce();

    await service.putSignUrl(params);

    expect(s3Spy).toHaveBeenCalled();
  });

  it('should call upload one file', async () => {
    const params: UploadParam = {
      Bucket: 'valid_bucket_name',
      ContentType: 'JPEG',
      Key: 'filename.jpeg',
      Body: file,
      Expires: new Date(),
    };

    const s3Spy = jest
      .spyOn(fakeS3, 'upload')
      .mockImplementationOnce(jest.fn());

    const service = new UploaderService(fakeS3);

    await service.uploadOne(params);

    expect(s3Spy).toHaveBeenLastCalledWith(params);
  });

  it('should call upload many files', async () => {
    const params: UploadParam = {
      Bucket: 'valid_bucket_name',
      ContentType: 'JPEG',
      Key: 'new.jpeg',
      Body: file,
      Expires: new Date(),
    };

    const s3Spy = jest
      .spyOn(fakeS3, 'upload')
      .mockImplementationOnce(jest.fn());

    const service = new UploaderService(fakeS3);

    await service.uploadMany([params, params]);

    expect(s3Spy).toHaveBeenLastCalledWith(params);
  });
});
