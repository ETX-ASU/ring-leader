// eslint-disable-next-line node/no-extraneous-import
import axios from "axios";
import jwt from "jsonwebtoken";
import got from "got";

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

const validateAud = (token: any, plateform: any): boolean => {
  console.log(
    "Validating if aud (Audience) claim matches the value of the tool's clientId given by the platform"
  );
  console.log("Aud claim: " + token.aud);
  console.log("Tool's clientId: " + plateform.clientId);

  if (Array.isArray(token.aud)) {
    console.log("More than one aud listed, searching for azp claim");
    if (token.azp && token.azp !== plateform.clientId)
      throw new Error("AZP_DOES_NOT_MATCH_CLIENTID");
  } else if (token.aud == plateform.clientId) return true;
  return true;
};

const getaccessTokenObject = (token: any): any => {
  const accessTokenObject = {
    jti: token.jti,
    iss: token.iss,
    aud: token.aud,
    iat: token.iat,
    nonce: token.nonce,
    sub: token.sub,
    exp: token.exp,
    client_id: token.client_id
  };
  return accessTokenObject;
};

/**
 * @description Validates Nonce.
 * @param {Object} token - Id token you wish to validate.
 */

const validateNonce = (token: any, plateform: any): boolean => {
  console.log("Validating nonce");
  console.log("Token Nonce: " + token.nonce);
  if (token.nonce == plateform.nonce) return true;
  else return false;
};

/**
 * @description Validates de token based on the LTI 1.3 core claims specifications.
 * @param {Object} token - Id token you wish to validate.
 */

const claimValidation = (token: any): any => {
  console.log("Initiating LTI 1.3 core claims validation");
  console.log("Checking Message type claim");
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
    console.log("Checking Target Link Uri claim");
    if (!token["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"])
      throw new Error("NO_TARGET_LINK_URI_CLAIM");
    console.log("Checking Resource Link Id claim");
    if (
      !token["https://purl.imsglobal.org/spec/lti/claim/resource_link"] ||
      !token["https://purl.imsglobal.org/spec/lti/claim/resource_link"].id
    )
      throw new Error("NO_RESOURCE_LINK_ID_CLAIM");
  }

  console.log("Checking LTI Version claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/version"])
    throw new Error("NO_LTI_VERSION_CLAIM");
  if (token["https://purl.imsglobal.org/spec/lti/claim/version"] !== "1.3.0")
    throw new Error("WRONG_LTI_VERSION_CLAIM");
  console.log("Checking Deployment Id claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/deployment_id"])
    throw new Error("NO_DEPLOYMENT_ID_CLAIM");
  console.log("Checking Sub claim");
  if (!token.sub) throw new Error("NO_SUB_CLAIM");
  console.log("Checking Roles claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/roles"])
    throw new Error("NO_ROLES_CLAIM");

  return true;
};
/**
 * @description Validates de token based on the OIDC specifications.
 * @param {Object} token - Id token you wish to validate.
 * @param {Platform} platform - Platform object.
 */

const oidcValidation = (token: any, plateform: any): any => {
  console.log("Token signature verified");
  console.log("Initiating OIDC aditional validation steps");
  const aud: boolean = validateAud(token, plateform);
  const nonce: boolean = validateNonce(token, plateform);
  const claims: boolean = claimValidation(token);

  return { aud: aud, nonce: nonce, claims: claims };
};

const rlValidateToken = (req: any, plateform: any): any => {
  console.log("plateform.nonce-" + plateform.nonce);
  console.log("plateform.state-" + plateform.state);
  console.log("plateform.client_id-" + plateform.client_id);

  const idToken = req.body.id_token;
  console.log("idToken:" + idToken);
  const decodedtoken = jwt.decode(idToken);
  console.log("decodedtoken:");
  console.log(JSON.stringify(decodedtoken));
  if (!decodedtoken) throw new Error("INVALID_JWT_RECEIVED");
  const oidcVerified: any = oidcValidation(decodedtoken, plateform);
  if (!oidcVerified.aud) throw new Error("AUD_DOES_NOT_MATCH_CLIENTID");
  if (!oidcVerified.nonce) throw new Error("NONCE_DOES_NOT_MATCH");
  if (!oidcVerified.claims) throw new Error("CLAIMS_DOES_NOT_MATCH");
  const objData = getaccessTokenObject(decodedtoken);
  const tokenDetails = {
    token: idToken,
    isValidToken: true,
    jti: objData.jti,
    iss: objData.iss,
    aud: objData.aud,
    sub: objData.sub
  };
  console.log(
    "rlValidateToken - tokenDetails value -" + JSON.stringify(tokenDetails)
  );

  return tokenDetails;
};
const rlProcessOIDCRequest = (req: any, state: string, nonce: string): any => {
  let oidcData = req.query;
  console.log("req.method:" + req.method);

  if (req.method == "POST") oidcData = req.body;
  console.log("Get Request query");
  console.log(req.query);

  if (isValidOIDCRequest(oidcData)) {
    let response = {};
    const objResponse = {
      scope: "openid",
      response_type: "id_token",
      response_mode: "form_post",
      client_id: oidcData.client_id,
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
    console.log("OIDC response object");
    console.log(response);
    return response;
  }
};
const getAccessToken = async (plateform: any, scopes: any): Promise<any> => {
  console.log("getAccessToken plateform value -" + JSON.stringify(plateform));

  const clientId = plateform.aud;

  const confjwt = {
    sub: clientId,
    iss: plateform.iss,
    aud: plateform.platformAccessTokenEndpoint,
    iat: Date.now() / 1000,
    exp: Date.now() / 1000 + 60,
    jti: plateform.jti
  };
  const jwtToken = await jwt.sign(confjwt, plateform.platformPrivateKey, {
    algorithm: plateform.alg,
    keyid: plateform.keyid
  });

  const payload = {
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: jwtToken,
    scope: scopes
  };
  console.log("jwtToken payload- " + payload);
  const access = await got
    .post(await plateform.platformAccessTokenEndpoint, {
      form: payload
    })
    .json();
  console.log("Access token received -" + access);
  console.log("Access token for the scopes - " + scopes);

  return access;
};
export { rlProcessOIDCRequest, rlValidateToken, getAccessToken };
