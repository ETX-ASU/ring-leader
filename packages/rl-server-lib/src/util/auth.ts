/*
Validate if the OIDC request has all the required parameters i.e. iss, login_hint and target_link_url
*/
import { getCookie } from "./cookie";

const isValidOIDCRequest = (oidcData: any): string[] => {
  const errors = [];
  if (!oidcData.iss) {
    errors.push("Issuer missing");
  }
  if (!oidcData.login_hint) {
    errors.push("Login hint missing");
  }
  if (!oidcData.target_link_uri) {
    errors.push("Target Link URI missing");
  }
  return errors;
};
const validOAuth2Reponse = (oAuth2Data: any): string[] => {
  const errors = [];

  // Check the grant type
  if (!oAuth2Data.grant_type) {
    errors.push("grant type missing");
  } else {
    if (oAuth2Data.grant_type !== "client_credentials") {
      errors.push("grant type invalid");
    }
  }

  // Check the client_id
  if (!oAuth2Data.client_id) {
    errors.push("client id missing");
  } else {
    //TODO: Must retrieve Consumer information from DB
    if (oAuth2Data.client_id === "") {
      errors.push("client id invalid");
    }
  }

  // Check the client_secret
  if (!oAuth2Data.client_secret) {
    errors.push("client secret missing");
  } else {
    //TODO: Must retrieve Consumer information from DB
    if (oAuth2Data.client_secret === "") {
      errors.push("client secret invalid");
    }
  }
  const nounce: any = getCookie("nounce");
  const state: any = getCookie("state");
  if (oAuth2Data.nonce === nounce) errors.push("NOUNCE_DOES_NOT_MATCH");

  if (oAuth2Data.state === state) errors.push("STATE_DOES_NOT_MATCH");
  return errors;
};
export { isValidOIDCRequest, validOAuth2Reponse };
