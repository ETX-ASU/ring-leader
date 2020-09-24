import { NamesAndRoles, RlPlatform } from "@asu-etx/rl-server-lib";
const getUsers = (platform: any): any => {
  return new NamesAndRoles().getMembers(platform);
};
const rlPlatform = (
  platformPrivateKey: string,
  authenticationEndpoint: string,
  accesstokenEndpoint: string,
  kid: string,
  alg: string,
  token: any
): any => {
  return new RlPlatform(
    platformPrivateKey,
    authenticationEndpoint,
    accesstokenEndpoint,
    kid,
    alg,
    token
  );
};
export { getUsers, rlPlatform };
