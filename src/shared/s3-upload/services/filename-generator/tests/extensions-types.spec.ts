import { ContentType } from '../../uploader/get-signed-url-param.interface';
import { Extension } from '../filename-generator.interface';

describe('images extensions', () => {
  it('should be defined only extensions for mimi types', () => {
    const mimes = Object.keys(ContentType);
    const extensions = Object.keys(Extension);

    expect(mimes).toEqual(extensions);
  });
});
