import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ExtensionType } from './services/filename-generator/filename-generator.interface';
import {
  IAvatar,
  IAvatarService,
} from './services/generate-avatar/generate-avatar.interface';
import { GenerateAvatarService } from './services/generate-avatar/generate-avatar.service';
import { UploaderService } from './services/uploader/uploader.service';
import { FilenameService } from './services/filename-generator/filename-generator.service';

interface Props {
  file: Buffer;
  height: number;
  left: number;
  top: number;
  width: number;
  extension: ExtensionType;
}

interface PropsFile {
  file: Buffer;
  extension: ExtensionType;
}

@Injectable()
export class UploadService {
  constructor(
    @Inject(GenerateAvatarService)
    private readonly avatarService: IAvatarService,
    @Inject(UploaderService)
    private readonly uploader: UploaderService,
    @Inject('BUCKET_NAME_PDF')
    private readonly bucketName: string,
    @Inject(FilenameService)
    private readonly filenameGenerator: FilenameService,
  ) {}

  async createAvatar(props: Props): Promise<IAvatar> {
    const { height, left, top, width, file, extension } = props;

    const result = await this.avatarService.create({
      cropPositions: { height, left, top, width },
      extension,
      file: file,
      userId: randomUUID(),
    });

    return result;
  }

  async uploadPDF(props: PropsFile) {
    const { file, extension } = props;

    if (extension !== 'PDF') {
      throw new BadRequestException(
        `${extension} is not valid format for this endpoint`,
      );
    }

    const pathFilename = this.filenameGenerator.generateRandomName('PDF');
    const aYearFromNow = new Date();

    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

    await this.uploader.putSignUrl({
      ContentType: 'PDF',
      Bucket: this.bucketName,
      Key: pathFilename,
      Body: file,
      Expires: aYearFromNow,
    });

    const uploadURL = await this.uploader.getSignUrl({
      Bucket: this.bucketName,
      ContentType: 'PDF',
      Key: pathFilename,
    });

    return uploadURL;
  }
}
