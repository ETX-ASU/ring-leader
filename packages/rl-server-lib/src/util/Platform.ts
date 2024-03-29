import AccessToken from "../models/AccessToken"
export interface Platform {
  accessTokenPostContentType: string;
  jti: string;
  iss: string;
  aud: string;
  iat: number;
  sub: string;
  exp: number;
  context_id: string;
  clientId: string;
  state: string;
  lineitems: string;
  lineitem: string;
  resourceLinkId: string;
  resource: any;
  accesstokenEndpoint: string;
  authOIDCRedirectEndpoint: string;
  kid: string;
  platformPrivateKey: string;
  idToken: string;
  alg: any;
  deepLinkingSettings: DeeplinkSettings;
  userId: string;
  roles: Roles[];
  isInstructor: boolean;
  isStudent: boolean;
  deploymentId: string;
  nonce: string;
  accessTokens: AccessToken[];
  accessTokensUpdated: boolean
  assignmentId: string;
  launchUri: string;
}

interface DeeplinkSettings {
  deep_link_return_url: string;
  data: string;
  accept_types: string;
  accept_multiple?: string | boolean;
}

interface Roles {
  role: string;
  claim: string;
}
