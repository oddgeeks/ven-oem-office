export interface ISalesforceTokenObject {
  token: string;
  instanceUrl: string;
  issuedAt: Date;
}

export interface ISalesforceTokenParams {
  accessToken: string;
  instanceUrl: string;
}
