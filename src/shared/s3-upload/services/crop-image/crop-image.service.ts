import { Injectable } from '@nestjs/common';
import { IImageService, bufferCropProps } from './crop-image.interface';
import * as sharp from 'sharp';

@Injectable()
export class ImageService implements IImageService {
  private toFloor(value: number): number {
    return Math.floor(value);
  }

  async cropAndResizeFromBuffer(props: bufferCropProps): Promise<Buffer> {
    const { width, height, left, top } = props.cropPositions;
    const image = sharp(props.file);
    return await image
      .extract({
        height: this.toFloor(height),
        left: this.toFloor(left),
        top: this.toFloor(top),
        width: this.toFloor(width),
      })
      .resize({
        width: props.resize.width,
        height: props.resize.height,
      })
      .png()
      .toBuffer();
  }
}
