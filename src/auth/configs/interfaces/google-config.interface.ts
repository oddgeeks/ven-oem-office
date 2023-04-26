export interface IGoogleConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: Array<string>;
  prompt?: string;
}
