import { BadRequestException } from '@nestjs/common';
import { ExtractFileType } from '../extract-file-type.service';

describe('extract extension for mimetype', () => {
  const extractor = new ExtractFileType();

  it('should return png', () => {
    const png = extractor.extractFromMimetype('image/png');
    expect(png).toBe('PNG');
  });

  it('should return bpm', () => {
    const bpm = extractor.extractFromMimetype('image/bmp');
    expect(bpm).toBe('BMP');
  });

  it('should return gif', () => {
    const gif = extractor.extractFromMimetype('image/gif');
    expect(gif).toBe('GIF');
  });

  it('should return jpeg', () => {
    const jpeg = extractor.extractFromMimetype('image/jpeg');
    expect(jpeg).toBe('JPEG');
  });

  test('Test description', () => {
    const t = () => {
      throw new TypeError();
    };
    expect(t).toThrow(TypeError);
  });

  it('should return ERROR', () => {
    const fn = () => extractor.extractFromMimetype('contentype/json' as any);
    expect(fn).toThrow(BadRequestException);
  });
});
