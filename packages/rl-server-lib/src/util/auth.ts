import jwt from "jsonwebtoken";
import axios from "axios";
import { Platform } from "./Platform";
import { logger } from "@asu-etx/rl-shared";
import AccessToken from "../models/AccessToken";
import verifyConsumerJwt from "./verifyConsumerJwt"

const isValidOIDCRequest = (oidcData: any): boolean => {
  if (!oidcData.iss) {
    throw new Error("ISSUER_MISSING_IN_OIDC_REQUEST");
  }
  if (!oidcData.login_hint) {
    throw new Error("LOGIN_HINT_MISSING_IN_OIDC_REQUEST");
  }
  if (!oidcData.target_link_uri) {
    throw new Error("TARGET_LINK_URI_MISSING_IN_OIDC_REQUEST");
  }
  return true;
};

/**
 * @description Validates Aud.
 * @param {Object} token - Id token you wish to validate.
 * @param {Platform} platform - Platform object.
 */

const validateAud = (token: any, platform: Platform): boolean => {
  logger.debug(
    "Validating if aud (Audience) claim matches the value of the tool's clientId given by the platform"
  );
  logger.debug("Aud claim: " + token.aud);
  logger.debug("Tool's clientId: " + platform.clientId);
  logger.debug("platform: " + JSON.stringify(platform));

  if (Array.isArray(token.aud)) {
    logger.debug("More than one aud listed, searching for azp claim");
    if (token.azp && token.azp !== platform.clientId)
      throw new Error("AZP_DOES_NOT_MATCH_CLIENTID");
  } else if (token.aud == platform.clientId) return true;
  return true;
};
/**
 * @description Validates Nonce.
 * @param {Object} token - Id token you wish to validate.
 */

const validateNonce = (token: any, session: any): boolean => {
  if (token.nonce == session.nonce || (session.platform && session.platform.nonce == token.nonce) || !session.nonce) return true;
  else return false;
};

/**
 * @description Validates de token based on the LTI 1.3 core claims specifications.
 * @param {Object} token - Id token you wish to validate.
 */

const claimValidation = (token: any): any => {
  //logger.debug("Initiating LTI 1.3 core claims validation");
  //logger.debug("Checking Message type claim");
  if (
    token["https://purl.imsglobal.org/spec/lti/claim/message_type"] !==
    "LtiResourceLinkRequest" &&
    token["https://purl.imsglobal.org/spec/lti/claim/message_type"] !==
    "LtiDeepLinkingRequest"
  )
    throw new Error("NO_MESSAGE_TYPE_CLAIM");

  if (
    token["https://purl.imsglobal.org/spec/lti/claim/message_type"] ===
    "LtiResourceLinkRequest"
  ) {
    //logger.debug("Checking Target Link Uri claim");
    if (!token["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"])
      throw new Error("NO_TARGET_LINK_URI_CLAIM");
    //logger.debug("Checking Resource Link Id claim");
    if (
      !token["https://purl.imsglobal.org/spec/lti/claim/resource_link"] ||
      !token["https://purl.imsglobal.org/spec/lti/claim/resource_link"].id
    )
      throw new Error("NO_RESOURCE_LINK_ID_CLAIM");
  }

  //logger.debug("Checking LTI Version claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/version"])
    throw new Error("NO_LTI_VERSION_CLAIM");
  if (token["https://purl.imsglobal.org/spec/lti/claim/version"] !== "1.3.0")
    throw new Error("WRONG_LTI_VERSION_CLAIM");
  //logger.debug("Checking Deployment Id claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/deployment_id"])
    throw new Error("NO_DEPLOYMENT_ID_CLAIM");
  //logger.debug("Checking Sub claim");
  if (!token.sub) throw new Error("NO_SUB_CLAIM");
  //logger.debug("Checking Roles claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/roles"])
    throw new Error("NO_ROLES_CLAIM");

  return true;
};
/**
 * @description Validates de token based on the OIDC specifications.
 * @param {Object} token - Id token you wish to validate.
 * @param {Platform} platform - Platform object.
 */

const oidcValidation = (token: any, platform: Platform): any => {
  //logger.debug("Token signature verified");
  //logger.debug("Initiating OIDC aditional validation steps");
  const aud: boolean = validateAud(token, platform);
  const nonce: boolean = validateNonce(token, platform);
  const claims: boolean = claimValidation(token);

  return { aud: aud, nonce: nonce, claims: claims };
};

const rlDecodeIdToken = async (idToken: any): Promise<any> => {
  //logger.debug(`idToken:${idToken}`);
  const decodedToken: any = jwt.decode(idToken, { complete: true });
  logger.debug(`decodedtoken:${JSON.stringify(decodedToken)}`);
  if (!decodedToken) throw new Error("INVALID_JWT_RECEIVED");
  if (!decodedToken.header.kid && !decodedToken.header.keyid) throw new Error("INVALID_JWT_RECEIVED_NO_KID");

  await verifyConsumerJwt(idToken, decodedToken);
  return decodedToken.payload;
};
const rlValidateToken = async (idToken: any, platform: Platform): Promise<any> => {
  const decodedToken = await rlDecodeIdToken(idToken);
  //logger.debug("platform.nonce-" + platform.nonce);
  //logger.debug("platform.state-" + platform.state);
  //logger.debug("platform.client_id-" + platform.clientId);

  const oidcVerified: any = oidcValidation(decodedToken, platform);
  if (!oidcVerified.aud) throw new Error("AUD_DOES_NOT_MATCH_CLIENTID");
  if (!oidcVerified.nonce) throw new Error("NONCE_DOES_NOT_MATCH");
  if (!oidcVerified.claims) throw new Error("CLAIMS_DOES_NOT_MATCH");
  return idToken;
};

const rlValidateDecodedToken = (decodedToken: any, session: any): any => {
  //logger.debug("platform.nonce-" + platform.nonce);
  //logger.debug("platform.state-" + platform.state);
  //logger.debug("platform.client_id-" + platform.clientId);

  const oidcVerified: any = oidcValidation(decodedToken, session);
  if (!oidcVerified.aud) throw new Error("AUD_DOES_NOT_MATCH_CLIENTID");
  if (!oidcVerified.nonce) throw new Error("NONCE_DOES_NOT_MATCH");
  if (!oidcVerified.claims) throw new Error("CLAIMS_DOES_NOT_MATCH");
};

const rlProcessOIDCRequest = (req: any, state: string, nonce: string): any => {
  let oidcData = req.query;
  logger.debug("req.method:" + req.method);

  if (req.method == "POST") oidcData = req.body;
  logger.debug(`oidcData ${JSON.stringify(oidcData)}`);
  logger.debug(`Get Request query: ${JSON.stringify(req.query)}`);

  if (!oidcData.iss && oidcData.id_token) {
    const state = oidcData.state;
    oidcData = decodeToken(oidcData.id_token);
    oidcData.state = state;
  }
  if (isValidOIDCRequest(oidcData)) {
    let response = {};
    const objResponse = {
      scope: "openid",
      response_type: "id_token",
      response_mode: "form_post",
      client_id: oidcData.client_id,
      iss: oidcData.iss,
      redirect_uri: oidcData.target_link_uri,
      login_hint: oidcData.login_hint,
      state: state,
      nonce: nonce,
      prompt: "none"
    };
    if (oidcData.lti_message_hint) {
      response = {
        ...objResponse,
        lti_message_hint: oidcData.lti_message_hint
      };
    } else {
      response = { ...objResponse };
    }

    if (oidcData.lti_deployment_id)
      response = {
        ...response,
        lti_deployment_id: oidcData.lti_deployment_id
      };
    //logger.debug("OIDC response object");
    //logger.debug(response);
    return response;
  }
};

const decodeToken = (id_token: string): any => {
  return jwt.decode(id_token);
}


const formUrlEncoded = (x: { [x: string]: string | number | boolean; }) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

const findAccessToken = (scopes: string, platform: Platform): string | null => {
  const accessTokens = platform.accessTokens.filter((accessToken: any) => {
    return accessToken.scopes === scopes;
  });

  if (accessTokens && accessTokens.length == 1) {
    const accessToken: AccessToken = new AccessToken(accessTokens[0]);
    if (!accessToken.isExpired()) {
      platform.accessTokensUpdated = false;
      return accessToken.token;
    }
    const index = platform.accessTokens.findIndex((accessToken: any) => {
      return accessToken.scopes === scopes;
    });
    if (index >= 0) {
      platform.accessTokens.splice(index, 1);
    }
  } else if (accessTokens.length > 1) {
    for (let i = 0; i++; i < accessTokens.length) {
      const index = platform.accessTokens.findIndex((accessToken: any) => {
        return accessToken.scopes === scopes;
      });
      if (index >= 0) {
        platform.accessTokens.splice(index, 1);
      }
    }
  }
  return null;
}


const getAccessToken = async (
  platform: Platform,
  scopes: any
): Promise<any> => {
  //logger.debug("platform to get access token-" + JSON.stringify(platform));

  const accessToken = findAccessToken(JSON.stringify(scopes), platform);
  if (accessToken) {
    return JSON.parse(accessToken);
  }
  const clientId = platform.aud;
  const now = Math.trunc(new Date().getTime() / 1000);
  const confjwt = {
    iss: clientId,
    sub: clientId,
    aud: [platform.accesstokenEndpoint],

    jti: platform.jti || "dffdbdce-a9f1-427b-8fca-604182198783"
  };
  logger.debug("confjwt- " + JSON.stringify(confjwt));

  const jwtToken = jwt.sign(confjwt, platform.platformPrivateKey, {
    expiresIn: 60,
    algorithm: platform.alg,
    keyid: platform.kid
  });

  const payload = {
    grant_type: "client_credentials",
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: jwtToken,
    scope: scopes
  };

  logger.info(`platform.accessTokenPostContentType: ${platform.accessTokenPostContentType}`);

  if (platform.accessTokenPostContentType == "application/json") {
    return await requestAccessTokenJson(platform, payload, scopes, false);
  } else {
    return await requestAccessTokenEncodedForm(platform, payload, scopes, false);

  }
  return null;
};

const requestAccessTokenEncodedForm = async (platform: any, payload: any, scopes: any, previousAttemptFailed: boolean): Promise<any> => {
  logger.info(`getting accesstoken encoded form at  -${platform.accesstokenEndpoint} : ${JSON.stringify(payload)}`);
  const params = new URLSearchParams();
  params.append("grant_type", payload["grant_type"]);
  params.append("client_assertion_type", payload["client_assertion_type"]);
  params.append("client_assertion", payload["client_assertion"]);
  params.append("scope", payload["scope"]);
  logger.info(`Params for getting accesstoken encoded form at -${platform.accesstokenEndpoint} : ${JSON.stringify(params.toString())}`);
  try {

    const str = `grant_type=${encodeURIComponent(payload.grant_type)}&client_assertion_type=${encodeURIComponent(payload.client_assertion_type)}&client_assertion=${encodeURIComponent(payload.client_assertion)}&scope=${encodeURIComponent(payload.scope)}`
    logger.info(`Params as str -${platform.accesstokenEndpoint} : ${str}`);
    const response = await axios
      .post(platform.accesstokenEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

    logger.debug(`Response token response header:X-Request-Cost: ${JSON.stringify(response.headers)}`);
    response.data.token_type = response.data.token_type.charAt(0).toUpperCase() + response.data.token_type.slice(1).toLowerCase();
    logger.debug(`Access Token generated (FORMX): ${JSON.stringify(response.data)}`);
    platform.accessTokens.push(new AccessToken({ scopes: JSON.stringify(scopes), token: JSON.stringify(response.data) }));
    platform.accessTokensUpdated = true;
    return response.data;
  } catch (error) {
    logger.error("failed to retrieve accessToken:" + JSON.stringify(error));
    throw Error("unable to obtain accessToken: " + JSON.stringify(error));
  }
}

const requestAccessTokenJson = async (platform: any, payload: any, scopes: any, previousAttemptFailed: boolean): Promise<any> => {
  logger.debug(`Posting too -${platform.accesstokenEndpoint} with json : ${JSON.stringify(payload)}`);
  try {
    const response = await axios.post(platform.accesstokenEndpoint, payload);
    logger.debug(`Response token response header:X-Request-Cost: ${JSON.stringify(response.headers)}`);
    response.data.token_type = response.data.token_type.charAt(0).toUpperCase() + response.data.token_type.slice(1).toLowerCase();
    logger.debug(`Access Token generated (JSON): ${JSON.stringify(response.data)}`);

    platform.accessTokens.push(new AccessToken({ scopes: JSON.stringify(scopes), token: JSON.stringify(response.data) }));
    platform.accessTokensUpdated = true;
    return response.data;
  } catch (error) {
    logger.error("failed to retrieve accessToken:" + JSON.stringify(error));
    throw Error("unable to obtain accessToken: " + JSON.stringify(error));
  }
}
export {
  rlProcessOIDCRequest,
  rlValidateToken,
  getAccessToken,
  rlValidateDecodedToken,
  rlDecodeIdToken
};
