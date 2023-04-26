import { FilenameService } from '../filename-generator.service';

describe('fileame-generator.service', () => {
  it('return a valid random name for png', () => {
    const filename = new FilenameService().generateRandomName('PNG');
    expect(filename.includes('.png')).toBe(true);
    expect(filename.length).toBeGreaterThan(10);
  });

  it('return a valid random name for gif', () => {
    const filename = new FilenameService().generateRandomName('GIF');
    expect(filename.includes('.gif')).toBe(true);
    expect(filename.length).toBeGreaterThan(10);
  });

  it('return a valid random name for jpeg', () => {
    const filename = new FilenameService().generateRandomName('JPEG');
    expect(filename.includes('.jpeg')).toBe(true);
    expect(filename.length).toBeGreaterThan(10);
  });
});
