import { PutObjectParam, UploadParam } from './get-signed-url-param.interface';

export interface IUploaderService {
  putObject: (param: PutObjectParam) => Promise<void>;
  uploadOne: (param: UploadParam) => Promise<void>;
  uploadMany: (params: UploadParam[]) => Promise<void>;
  getSignUrl: (param: UploadParam) => Promise<string>;
  putSignUrl: (param: UploadParam) => Promise<void>;
}
