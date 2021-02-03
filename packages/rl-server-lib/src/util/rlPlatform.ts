import jwt from "jsonwebtoken";
import { Platform } from "./Platform";
import {
  logger,
  DEEP_LINKING_SETTINGS_CLAIM,
  ROLES_CLAIM,
  INSTRUCTOR_ROLE_CLAIM,
  LEARNER_ROLE_CLAIM,
  UNKNOWN_HELPER_ROLE_CLAIM,
  STUDENT_ROLE_CLAIM,
  MENTOR_ROLE_CLAIM,
  DEPLOYMENT_ID_CLAIM,
  CONTEXT_CLAIM,
  ASSIGNMENT_GRADE_CLAIM,
  RESOURCE_LINK_CLAIM
} from "@asu-etx/rl-shared";

const setDefaultValues = (token: any): any => {
  //logger.debug("setDefaultValues - " + JSON.stringify(token));
  /*logger.debug(
    DEEP_LINKING_SETTINGS_CLAIM + token[DEEP_LINKING_SETTINGS_CLAIM]
  );*/
  let isStudent = false;
  let isInstructor = false;
  logger.debug("testing role claims");
  if (token[ROLES_CLAIM]) {
    if (hasRole(INSTRUCTOR_ROLE_CLAIM, "instructor", token[ROLES_CLAIM])) {
      isInstructor = true;
    } else if (hasRole(UNKNOWN_HELPER_ROLE_CLAIM, "helper", token[ROLES_CLAIM])) {
      isInstructor = true;
    } else if (hasRole(LEARNER_ROLE_CLAIM, "learner", token[ROLES_CLAIM])) {
      isStudent = true;
    } else if (hasRole(STUDENT_ROLE_CLAIM, "student", token[ROLES_CLAIM])) {
      isStudent = true;
    } else if (hasRole(MENTOR_ROLE_CLAIM, "mentor", token[ROLES_CLAIM])) {
      isStudent = true;
    }
  }

  const assignmentGradeClaim = token[ASSIGNMENT_GRADE_CLAIM];
  const resourceLinkClaim = token[RESOURCE_LINK_CLAIM];
  const deepLinkSettingsClaim = token[DEEP_LINKING_SETTINGS_CLAIM];

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
    deploymentId: token[DEPLOYMENT_ID_CLAIM] || null,
    roles: [
      {
        role: "learner",
        claim: LEARNER_ROLE_CLAIM
      },
      {
        role: "instructor",
        claim: INSTRUCTOR_ROLE_CLAIM
      }
    ],
    isStudent: isStudent,
    isInstructor: isInstructor,
    context: token[CONTEXT_CLAIM],
    lineitems: assignmentGradeClaim ? assignmentGradeClaim.lineitems : null,
    lineitem: assignmentGradeClaim ? assignmentGradeClaim.lineitem : null,
    resourceLinkId: resourceLinkClaim ? resourceLinkClaim.id : null,
    resource: resourceLinkClaim,
    accessTokens: [],
    accessTokensUpdated: false,
    deepLinkingSettings: deepLinkSettingsClaim
      ? {
        deep_link_return_url: deepLinkSettingsClaim.deep_link_return_url || null,
        data: deepLinkSettingsClaim.data || null,
        accept_types: deepLinkSettingsClaim.accept_types
      }
      : null
  };
  //logger.debug("setDefaultValues - tokenData - " + JSON.stringify(tokenData));
  return tokenData;
};

const hasRole = (roleClaim: string, role: string, roles: [any]): Boolean => {
  if (roles.includes(roleClaim)) {
    return true;
  }
  for (let i = 0; i < roles.length; i++) {
    if (roles[i] && roles[i].toLowerCase() == role) {
      return true;
    }
  }
  return false;
}
const rlPlatform = (
  platformPrivateKey: string,
  authenticationEndpoint: string,
  accesstokenEndpoint: string,
  accessTokenPostContentType: string,
  kid: string,
  alg: string,
  idToken: string,
): Platform => {
  const token = jwt.decode(idToken);
  /*logger.debug(
    `rlPlatform - received - idTokenDecoded: ${JSON.stringify(token)}`
  );*/
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
    resource: tokenData.resource,
    accesstokenEndpoint: accesstokenEndpoint,
    authOIDCRedirectEndpoint: authenticationEndpoint,
    kid: kid,
    platformPrivateKey: platformPrivateKey,
    idToken: idToken,
    alg: alg,
    deepLinkingSettings: tokenData.deepLinkingSettings,
    userId: tokenData.userId,
    roles: tokenData.roles,
    accessTokens: tokenData.accessTokens,
    accessTokensUpdated: tokenData.accessTokensUpdated,
    isInstructor: tokenData.isInstructor,
    isStudent: tokenData.isStudent,
    deploymentId: tokenData.deploymentId,
    accessTokenPostContentType: accessTokenPostContentType

  };
  //logger.debug("rlPlatformplatform - " + JSON.stringify(platform));

  return platform;
};
export { rlPlatform };
