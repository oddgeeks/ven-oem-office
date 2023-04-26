import * as request from 'superagent';

export const getBase64FromUrl = async (url: string, retries = 0) => {
  try {
    const response = await request.get(url).buffer(true);
    const contentType = response.headers['content-type'];

    return `data:${contentType};base64,${response.body.toString('base64')}`;
  } catch (err) {
    // console.log(`getBase64FromUrl error for ${url}, retries = ${retries}`, err);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    if (retries >= 10) {
      throw err;
    }

    return getBase64FromUrl(url, retries + 1);
  }
};
