/**
 * Do not change
 * extensions are linked to ContentType
 * @link ContentType
 * @see ContentType on get-signed-url
 */
export enum Extension {
  PNG = 'png',
  JPEG = 'jpeg',
  BMP = 'bmp',
  GIF = 'gif',
  PDF = 'pdf',
}

export type ExtensionType = keyof typeof Extension;
export interface IFilenameService {
  generateRandomName: (extension: ExtensionType) => string;
}
