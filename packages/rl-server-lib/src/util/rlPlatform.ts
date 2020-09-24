import jwt from "jsonwebtoken";

const setDefaultValues = (token: any): any => {
  console.log("setDefaultValues - " + JSON.stringify(token));

  const tokenData = {
    jti: encodeURIComponent(
      [...Array(25)]
        .map((_) => ((Math.random() * 36) | 0).toString(36))
        .join("-")
    ),
    iss: token.iss,
    aud: token.aud,
    iat: token.iat,
    sub: token.sub,
    exp: token.exp,
    clientId: token.client_id,
    lineitems:
      token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"].lineitems,
    resourceLinkId:
      token["https://purl.imsglobal.org/spec/lti/claim/resource_link"].id
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
    jti: tokenData.jti,
    iss: tokenData.iss,
    aud: tokenData.aud,
    iat: tokenData.iat,
    sub: tokenData.sub,
    exp: tokenData.exp,
    clientId: tokenData.clientId,
    lineitems: tokenData.lineitems,
    resourceLinkId: tokenData.resourceLinkId,
    accesstokenEndpoint: accesstokenEndpoint,
    authOIDCRedirectEndpoint: authenticationEndpoint,
    kid: kid,
    platformPublicKey: platformPublicKey,
    idToken: idToken,
    alg: alg,
    roles: [
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
