import jwt from "jsonwebtoken";

const setDefaultValues = (token: any): any => {
  console.log("setDefaultValues - " + JSON.stringify(token));
  console.log(
    "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings" +
      token[
        "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"
      ]
  );

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
    userId: token.sub,
    lineitems: token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"]
      ? token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"]
          .lineitems
      : null,
    lineitem: token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"]
      ? token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"].lineitem
      : null,
    resourceLinkId: token[
      "https://purl.imsglobal.org/spec/lti/claim/resource_link"
    ]
      ? token["https://purl.imsglobal.org/spec/lti/claim/resource_link"].id
      : null,
    deepLinkingSettings: token[
      "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"
    ]
      ? {
          deep_link_return_url:
            token[
              "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"
            ].deep_link_return_url || null,
          data: token.data || null,
          accept_types:
            token[
              "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"
            ].accept_types
        }
      : null
  };
  console.log("setDefaultValues - tokenData - " + JSON.stringify(tokenData));
  return tokenData;
};
const RlPlatform = (
  platformPrivateKey: string,
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
    lineitem: tokenData.lineitem,
    resourceLinkId: tokenData.resourceLinkId,
    accesstokenEndpoint: accesstokenEndpoint,
    authOIDCRedirectEndpoint: authenticationEndpoint,
    kid: kid,
    platformPrivateKey: platformPrivateKey,
    idToken: idToken,
    alg: alg,
    deepLinkingSettings: tokenData.deepLinkingSettings,
    userId: tokenData.UserId,
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
