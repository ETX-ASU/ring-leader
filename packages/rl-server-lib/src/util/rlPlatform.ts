import jwt from "jsonwebtoken";

const setDefaultValues = (token: any): any => {
  console.log("setDefaultValues - " + JSON.stringify(token));

  const tokenData = {
    Jti: encodeURIComponent(
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
  console.log("setDefaultValues - tokenData - " + JSON.stringify(tokenData));
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
  console.log("RlPlatform - tokenData - " + JSON.stringify(tokenData));
  const platform = {
    Jti: tokenData.Jti,
    Iss: tokenData.Iss,
    Aud: tokenData.Aud,
    Iat: tokenData.Iat,
    Sub: tokenData.Sub,
    Exp: tokenData.Exp,
    ClientId: tokenData.ClientId,
    AccesstokenEndpoint: accesstokenEndpoint,
    AuthOIDCRedirectEndpoint: authenticationEndpoint,
    Kid: kid,
    PlatformPublicKey: platformPublicKey,
    IdToken: idToken,
    Alg: alg,
    Roles: [
      {
        role: "Instructor",
        claim: "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"
      },
      {
        role: "Learner",
        claim: "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"
      }
    ]
  };
  console.log("RlPlatformplatform - " + JSON.stringify(platform));

  return platform;
};
export { RlPlatform };
