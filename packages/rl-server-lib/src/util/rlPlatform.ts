import jwt from "jsonwebtoken";
import { Platform } from "./Platform";
import { logger } from "@asu-etx/rl-shared";

const setDefaultValues = (token: any): any => {
  logger.debug("setDefaultValues - " + JSON.stringify(token));
  logger.debug(
    "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings" +
      token[
        "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"
      ]
  );
  let isStudent = false;
  let isInstructor = false;
  if (token["https://purl.imsglobal.org/spec/lti/claim/roles"]) {
    if (
      token["https://purl.imsglobal.org/spec/lti/claim/roles"].includes(
        "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"
      )
    ) {
      isStudent = true;
    } else if (
      token["https://purl.imsglobal.org/spec/lti/claim/roles"].includes(
        "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"
      )
    ) {
      isInstructor = true;
    }
  }

  const tokenData = {
    jti: encodeURIComponent(
      [...Array(25)]
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map((_) => ((Math.random() * 36) | 0).toString(36))
        .join("-")
    ),
    iss: token.iss,
    aud: token.aud,
    iat: token.iat,
    sub: token.sub,
    exp: token.exp,
    nonce: token.nonce,
    clientId: token.aud,
    userId: token.sub,
    deploymentId:
      token["https://purl.imsglobal.org/spec/lti/claim/deployment_id"] || null,
    roles: [
      {
        role: "Learner",
        claim: "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"
      },
      {
        role: "Instructor",
        claim: "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"
      }
    ],
    isStudent: isStudent,
    isInstructor: isInstructor,
    context: token["https://purl.imsglobal.org/spec/lti/claim/context"],
    lineitems: token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"]
      ? token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"]
          .lineitems
      : null,
    lineitem: token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"]
      ? token["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"].lineitem
      : null,
    resourceLinkId: token.resourceLinkId || null,
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
  logger.debug("setDefaultValues - tokenData - " + JSON.stringify(tokenData));
  return tokenData;
};
const rlPlatform = (
  platformPrivateKey: string,
  authenticationEndpoint: string,
  accesstokenEndpoint: string,
  kid: string,
  alg: string,
  idToken: string
): Platform => {
  const token = jwt.decode(idToken);
  logger.debug(
    `rlPlatform - received - idTokenDecoded: ${JSON.stringify(token)}`
  );
  const tokenData = setDefaultValues(token);
  const platform: Platform = {
    jti: tokenData.jti,
    iss: tokenData.iss,
    aud: tokenData.aud,
    iat: tokenData.iat,
    sub: tokenData.sub,
    exp: tokenData.exp,
    state: tokenData.exp || null,
    nonce: tokenData.nonce,
    context_id: tokenData.context.id,
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
    userId: tokenData.userId,
    roles: tokenData.roles,
    isInstructor: tokenData.isInstructor,
    isStudent: tokenData.isStudent,
    deploymentId: tokenData.deploymentId
  };
  logger.debug("rlPlatformplatform - " + JSON.stringify(platform));

  return platform;
};
export { rlPlatform };
