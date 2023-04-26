// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as path from 'path';
import * as fs from 'fs';

const getFolderPath = () => __dirname || process.cwd();
const getFilePath = (fileName) => path.join(getFolderPath(), `${fileName}`);

/**
 * @param {string} fileName - Included File Name & its Extension
 * @param {Array<*>} arrayData
 * @return {Promise<*>}
 */
const writeFileAsync = async (fileName, arrayData) => {
  const filePath = getFilePath(fileName);

  return new Promise((resolve, reject) => {
    try {
      const _WritableStream = fs.createWriteStream(filePath, {
        flags: 'r+',
        start: fs.statSync(filePath).size - 2,
      });
      _WritableStream.write(
        JSON.stringify(arrayData, null, 2).replace(/\[/, ','),
        (streamError) => {
          return reject(['STREAM_WRITE_FAILURE', streamError]);
        },
      );
      return resolve('STREAM_WRITE_SUCCESS');
    } catch (streamError) {
      /** ERROR NOT FOUND SUCH FILE OR DIRECTORY !*/
      if (streamError.code === 'ENOENT') {
        fs.mkdirSync(getFolderPath(), { recursive: true });
        return resolve(
          fs.writeFileSync(
            filePath,
            JSON.stringify(
              Array.from({ ...arrayData, length: arrayData.length }),
              null,
              2,
            ),
          ),
        );
      }
      /** ERROR OUT OF BOUND TO FILE SIZE RANGE - INVALID START POSITION FOR WRITE STREAM !*/
      if (streamError instanceof RangeError) {
        console.error(`> [ERR_OUT_OF_RANGE] =>`, streamError);
        const _WritableStream = fs.createWriteStream(filePath, { flags: 'r+' });
        return resolve(
          _WritableStream.write(
            JSON.stringify(arrayData, null, 2),
            (streamError) => {
              return reject(['STREAM_WRITE_FAILURE', streamError]);
            },
          ),
        );
      }
      return reject(['STREAM_WRITE_FAILURE', streamError]);
    }
  });
};
