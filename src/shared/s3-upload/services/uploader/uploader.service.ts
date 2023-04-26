import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import {
  ContentType,
  PathFromExtension,
  GetPresignedParam,
  PutObjectParam,
  TypeContent,
  UploadParam,
  DeleteObjectParam,
} from './get-signed-url-param.interface';
import { IUploaderService } from './uploader.interface';
import { s3SigningService } from '../s3-signing/s3-signer.service';

const signer = new s3SigningService();

@Injectable()
export class UploaderService implements IUploaderService {
  constructor(
    @Inject(S3)
    private readonly s3: S3, // @Inject(s3SigningService) // private readonly signer: s3SigningService = new s3SigningService(),
  ) {}

  async uploadOne(param: UploadParam): Promise<void> {
    this.s3.upload(param);
  }

  async uploadMany(params: UploadParam[]): Promise<void> {
    const promises: Promise<unknown>[] = [];
    const upload = (param: UploadParam) => {
      return new Promise((resolve, _rej) => {
        resolve(this.s3.upload(param));
      });
    };

    params.map((param) => promises.push(upload(param)));

    await Promise.all(promises);
  }

  async putObject(params: PutObjectParam): Promise<void> {
    const aYearFromNow = new Date();

    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

    await this.s3
      .putObject({
        Key: params.Key,
        ContentType: params.ContentType,
        Body: params.Body,
        Bucket: params.Bucket,
        Expires: params.Expires,
        //ACL: 'public-read',
      })
      .promise();
  }

  async deleteObject(params: DeleteObjectParam): Promise<void> {
    await this.s3
      .deleteObject({
        Key: params.Key,
        Bucket: params.Bucket,
      })
      .promise();
  }

  /**
   * @param config as object
   * @property `Bucket` bucket name as string
   * @property `Key` filename as string
   * @property `Expires` expiration time in milliseconds
   * @returns url as string
   */
  async putSignUrl(params: UploadParam): Promise<void> {
    const content: TypeContent = ContentType[
      params.ContentType
    ] as unknown as TypeContent;

    return await this.putObject({
      Body: params.Body,
      Bucket: params.Bucket,
      ContentType: content,
      Key: params.Key,
      Expires: params.Expires,
    });
  }

  /**
   * @param config as object
   * @property `Bucket` bucket name as string
   * @property `Key` filename as string
   * @property `Expires` expiration time in milliseconds
   * @returns url as string
   */
  async getSignUrl(params: GetPresignedParam): Promise<string> {
    const path = PathFromExtension[params.ContentType];

    const url: string = await signer.get(
      // `https://${params.Bucket}.s3.amazonaws.com/${path}/${params.Key}.${params.ContentType.toLowerCase()}`,
      `${process.env.BUCKET_URL}/${path}/${params.Key}`,
    );

    return url;
  }
}
