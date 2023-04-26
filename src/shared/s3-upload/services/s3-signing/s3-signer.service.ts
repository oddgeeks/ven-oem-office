// eslint-disable-next-line @typescript-eslint/no-var-requires
const cfsign = require('aws-cloudfront-sign');
import { Injectable } from '@nestjs/common';

@Injectable()
export class s3SigningService {
  /**
   * @param objectURL as string
   * @returns url as string
   */
  async get(objectURL: string): Promise<string> {
    const aYearFromNow = new Date();

    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

    const signingParams = {
      keypairId: process.env.PUBLIC_KEY_ID,
      // Optional - this can be used as an alternative to privateKeyString
      privateKeyPath: `${process.env.PWD}/${process.env.PRIVATE_KEY}`,
      expireTime: aYearFromNow,
    };

    // Generating a signed URL
    const signedUrl = await cfsign.getSignedUrl(objectURL, signingParams);

    return signedUrl;
  }
}
