import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ImageService } from './services/crop-image/crop-image.service';
import { FilenameService } from './services/filename-generator/filename-generator.service';
import { GenerateAvatarService } from './services/generate-avatar/generate-avatar.service';
import { UploaderService } from './services/uploader/uploader.service';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import {
  AWS_BUCKET_REGION,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_SECRET_KEY_ID,
  BUCKET_NAME,
} from '../../environments';
import { FilesConverterService } from './services/files-converter/files-converter.service';

@Module({
  imports: [],
  providers: [
    FilesConverterService,
    FilenameService,
    ImageService,
    {
      provide: 'BUCKET_NAME_IMAGE',
      useValue: BUCKET_NAME + '/images',
    },
    {
      provide: 'BUCKET_NAME_PDF',
      useValue: BUCKET_NAME + '/pdf',
    },
    {
      provide: S3,
      useFactory: () =>
        new S3({
          region: AWS_BUCKET_REGION,
          signatureVersion: 'v2',
          credentials: {
            accessKeyId: AWS_S3_SECRET_KEY_ID,
            secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
          },
        }),
    },
    UploaderService,
    UploadService,
    GenerateAvatarService,
  ],
  controllers: [UploadController],
  exports: [GenerateAvatarService, FilesConverterService],
})
export class UploadModule {}
