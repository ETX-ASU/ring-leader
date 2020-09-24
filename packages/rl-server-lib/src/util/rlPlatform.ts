import jwt from "jsonwebtoken";

const setDefaultValues = (token: any): any => {
  console.log("setDefaultValues - " + JSON.stringify(token));

  const tokenData = {
    Jti:
      token.jti ||
      encodeURIComponent(
        [...Array(25)]
          .map((_) => ((Math.random() * 36) | 0).toString(36))
          .join("-")
      ),
    Iss: token.iss,
    Aud: token.aud,
    Iat: token.iat,
    Sub: token.sub,
    Exp: token.exp,
    ClientId: token.client_id
  };
  console.log("setDefaultValues - tokenData - " + JSON.stringify(token));
  return tokenData;
};
const RlPlatform = (
  platformPublicKey: string,
  authenticationEndpoint: string,
  accesstokenEndpoint: string,
  kid: string,
  alg: string,
  idToken: string
): any => {
  const token = jwt.decode(idToken);
  const tokenData = setDefaultValues(token);
  const platform = {
    AccesstokenEndpoint: accesstokenEndpoint,
    AuthOIDCRedirectEndpoint: authenticationEndpoint,
    Kid: kid,
    PlatformPublicKey: platformPublicKey,
    IdToken: idToken,
    Alg: alg,
    Jti: tokenData.jti,
    Iss: tokenData.iss,
    Aud: tokenData.aud,
    Iat: tokenData.iat,
    Sub: tokenData.sub,
    Exp: tokenData.exp,
    ClientId: tokenData.client_id
  };
  console.log("RlPlatformplatform - " + platform);

  return platform;
};
export { RlPlatform };
