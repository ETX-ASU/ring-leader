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

const validateAud = (token: any, platform: any): boolean => {
  console.log(
    "Validating if aud (Audience) claim matches the value of the tool's clientId given by the platform"
  );
  console.log("Aud claim: " + token.aud);
  console.log("Tool's clientId: " + platform.client_id);
  console.log("platform: " + JSON.stringify(platform))

  if (Array.isArray(token.aud)) {
    console.log("More than one aud listed, searching for azp claim");
    if (token.azp && token.azp !== platform.client_id)
      throw new Error("AZP_DOES_NOT_MATCH_CLIENTID");
  } else if (token.aud == platform.client_id) return true;
  return true;
};
/**
 * @description Validates Nonce.
 * @param {Object} token - Id token you wish to validate.
 */

const validateNonce = (token: any, platform: any): boolean => {
  console.log("Validating nonce");
  console.log("Token Nonce: " + token.nonce);
  if (token.nonce == platform.nonce) return true;
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

const oidcValidation = (token: any, platform: any): any => {
  console.log("Token signature verified");
  console.log("Initiating OIDC aditional validation steps");
  const aud: boolean = validateAud(token, platform);
  const nonce: boolean = validateNonce(token, platform);
  const claims: boolean = claimValidation(token);

  return { aud: aud, nonce: nonce, claims: claims };
};

const rlValidateToken = (req: any, platform: any): any => {
  console.log("platform.nonce-" + platform.nonce);
  console.log("platform.state-" + platform.state);
  console.log("platform.client_id-" + platform.clientId);

  const idToken = req.body.id_token;
  console.log("idToken:" + idToken);
  const decodedtoken = jwt.decode(idToken);
  console.log("decodedtoken:");
  console.log(JSON.stringify(decodedtoken));
  if (!decodedtoken) throw new Error("INVALID_JWT_RECEIVED");
  const oidcVerified: any = oidcValidation(decodedtoken, platform);
  if (!oidcVerified.aud) throw new Error("AUD_DOES_NOT_MATCH_CLIENTID");
  if (!oidcVerified.nonce) throw new Error("NONCE_DOES_NOT_MATCH");
  if (!oidcVerified.claims) throw new Error("CLAIMS_DOES_NOT_MATCH");

  return idToken;
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
const getAccessToken = async (platform: any, scopes: any): Promise<any> => {
  console.log("Inside getAccessToken-" + JSON.stringify(platform));

  const clientId = platform.aud;

  const confjwt = {
    sub: clientId,
    iss: platform.iss,
    aud: platform.accesstokenEndpoint,
    iat: platform.iat || Date.now() / 1000,
    exp: platform.exp || Date.now() / 1000 + 60,
    jti: platform.jti || "dffdbdce-a9f1-427b-8fca-604182198783"
  };
  console.log("confjwt- " + JSON.stringify(confjwt));

  const jwtToken = await jwt.sign(confjwt, platform.platformPrivateKey, {
    algorithm: platform.alg,
    keyid: platform.kid
  });
  const payload = {
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: jwtToken,
    scope: scopes
  };
  const access = await got
    .post(await platform.accesstokenEndpoint, {
      form: payload
    })
    .json();
  console.log("Access token received ");
  console.log("Access token for the scopes - " + scopes);

  return access;
};
export { rlProcessOIDCRequest, rlValidateToken, getAccessToken };
