// eslint-disable-next-line node/no-extraneous-import
import axios from "axios";
import jwt from "jsonwebtoken";
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
    jti: token.token,
    iss: token.iss,
    aud: token.aud,
    iat: token.iat,
    nonce: token.nonce,
    sub: token.sub,
    exp: token.exp
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
  const tokenDetails = {
    token: idToken,
    isValidToken: true,
    ...getaccessTokenObject(decodedtoken)
  };
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
  const clientId = plateform.client_id;
  const confjwt = {
    sub: clientId,
    iss: plateform.iss,
    aud: plateform.platformAccessTokenEndpoint,
    iat: plateform.iat,
    exp: plateform.exp,
    jti: plateform.jti
  };
  console.log("confjwt-" + JSON.stringify(confjwt));
  const platformPrivateKey =
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDB6FNGSUu3jmZ\nLlIigYOrEq2rNIK8/0614RUAQKpVkY1FaRNRthsOJ9Xz0wK4QcZn2eRxkfxKYMNB\n4Z/pvKlXACtkjwbJ/zResrzG9QTIKpskXs3C/tNDgDdIQXvJcfz/2gN4zFdihR7m\nDR+qrG/MFUA85zY/gG2wRSveSia3pA45D4t3odakWX7OizNR0A7pbHHpXz0gmGLz\nv64B6WVpwqWEc7vvNBQBpYA5P5Y7XRotZ/kmwzP+shYOE3Mm5x5HMORxsK7+ZPDw\ng8Qy5dAaXR+OTtW6fKpwZZwBsS5R5BTpB2nu45Cz2BscjdFbJRzUOT8AmljqFj1x\n1MUGiMOfAgMBAAECggEAO/qNvcM87zQCrLxVIC2Ki8Mby+pDRtKRp1fIeKJqgBRa\nSP1uppOFsI3Ju8mqLXZ1CR02p0LJPyqRAiLcZirSPWJc9fkSkm688V6wtdNGnDSW\nL9JEH3L1D+5PkhYpdqNqtlia9ryJJ1BfV0qz8W5El5P1hIVq5o6drTcorZ1KWPE+\nDB4bcdCWHCYq4Iw0SExQGRBao/YcLK+73BtFLDaF/yG6zVwRige+Utn0tnuJT69F\nObPaSjL7EvV+yMV7j5ZZgiQ8Ki6h74BV0Or3/o4ADwTS87rI7aHxRYL6euZcrwlz\nazrV7lRr3dRc7MVa/S3/4iPlShzizQBk98ZXBtEmiQKBgQD38WPYiNiCYFhv9P2j\n17+K11Tq6zLBLmxpyRJTr6WBEo7B6JtE2Mte47Rf5w8tuY5LFw9PDQp3QfeHuFFM\no7AfljayV3Sh6kIQ7LivplEV5fPDVpnShUwh8T4Pt3ltYODwx9xDkdcNPr0LhOQY\npdwwgJMbvyv8ZAWmH0jM8L5EKwKBgQDJXg/Edj+LJwdBi516SMMeyJuNFeqJMkCX\n/TQzptLIKQX2CaB3HJdRVrBd1EM8DH0jl1Ro1tTuZq5dokGrfz2I9EyCugkXRrxe\nkenu+KVbznUlzA1OMUd18ld/G3PgHmSrr0h5yQU4ZpW8WD2SHS8MnMMRANqn8m6b\nxA6ErT4AXQKBgGTVwhKFDPBw+GaHz0N78cUob7uebaTNGYAoKxDnxTpp7q8Dx2nH\ndWYg2vGJyc2BwlHdjfdLSW9Y369NkZrGk1E1SQdcs+1JlRbG/xFIZX+vZmSR6rsI\nRP8k2mWP641FMhYaYgUE4d3cHwv5Pr6bbaI4GBvXsq7Ris6VuIjIe8jDAoGBAMYZ\n7XUfx9/D45WOHrzgvGSagr1H5FZYw8dC6IowAom8Igss6VqFHDB/Ej8cxZBb0Pik\ntfv17cEj70JakDSBly4W+PZawvrNMh/veK8KmtM4x3MJzcUxIdZdNcrsXRENlYh5\nhtmY87PK6GBEhz4py9Ginx0pM/OpwzsmpAnOzYJZAoGAQXuFrooAf4HaKlEg3WJX\nuIU5GBLnEmreFTeEuoThwW7ZIBpItlZ2S07h8Lbt8kUT/Bmx6g2/MMwu79OgTt3u\nEZP+SwmaR+04J8x/iGpTnXQ5DPCLQ1XECCX9zXtNfzdgdEKC1+Qsx+X4eGXVG6t0\nv4Bi04mrNCbBi+qfMZwKN8I=\n-----END PRIVATE KEY-----\n"; //plateform.platformKid
  const token = jwt.sign(confjwt, platformPrivateKey, {
    algorithm: "RS256", //plateform.alg,
    keyid: "ASU ETX - Ring Leader - canvas-unicon - Public Key"
  });
  const message = {
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: token,
    scope: scopes
  };
  console.log(message);
  await axios
    .post(plateform.platformAccessTokenEndpoint, {
      data: message
    })
    .then((access) => {
      console.log("Successfully generated new access_token");
      return access.data.json();
    })
    .catch((err) => {
      console.log("Error generating new access_token");
      console.log(err);
      return err;
    });
};
export { rlProcessOIDCRequest, rlValidateToken, getAccessToken };
