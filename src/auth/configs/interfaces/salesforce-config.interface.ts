export interface ISalesforceConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: Array<string>;
  prompt?: string;
  authorizationURL?: string;
  profileURL?: string;
  tokenURL?: string;
}
