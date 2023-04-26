import { IPositions } from '../crop-image/crop-image.interface';
import { ExtensionType } from '../filename-generator/filename-generator.interface';
export interface IAvatar {
  original: string;
  /* 
  _64x64: string;
  _100x100: string;
  _256x256: string;
  _512x512: string; */
}

export interface AvatarProps {
  file: Buffer;
  userId: string;
  cropPositions: IPositions;
  extension: ExtensionType;
}
export interface IAvatarService {
  create: (props: AvatarProps) => Promise<IAvatar>;
}
