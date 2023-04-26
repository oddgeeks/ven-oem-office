export interface IPositions {
  top: number;
  left: number;
  height: number;
  width: number;
}
export interface bufferCropProps {
  file: Buffer;
  cropPositions: IPositions;
  resize: resizeProps;
}
export interface resizeProps {
  width: number;
  height?: number;
}
export interface IImageService {
  cropAndResizeFromBuffer: (props: bufferCropProps) => Promise<Buffer>;
}
