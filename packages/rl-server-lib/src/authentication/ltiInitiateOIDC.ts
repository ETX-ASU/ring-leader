import url from "url";
/*
Validate if the OIDC request has all the required parameters i.e. iss, login_hint and target_link_url
*/
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
/*
 * Create a long, unique string consisting of upper and lower case letters and numbers.
 * @param length - desired length of string
 * @param signed - boolean whether string should be signed with Tool's private key
 * @returns unique string
 */
const generateUniqueString = (length: number, signed: boolean): string => {
  let uniqueString = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    uniqueString += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  if (signed) {
    //TODO: if signed === true, sign the string with our private key
  }
  return uniqueString;
};

const ltiInitiateOIDC = (req: any, res: any): any => {
  const oidcData = req.body;
  const errors = ([] = isValidOIDCRequest(oidcData));
  if (errors.length === 0) {
    let responseWithLTIMessageHint = {};
    let response = {
      scope: "openid",
      response_type: "id_token",
      client_id: oidcData.consumerToolClientID,
      redirect_uri: oidcData.target_link_uri,
      login_hint: oidcData.body.login_hint,
      state: generateUniqueString(30, true),
      response_mode: "form_post",
      nonce: generateUniqueString(25, false),
      prompt: "none"
    };
    if (oidcData.hasOwnProperty("lti_message_hint")) {
      responseWithLTIMessageHint = {
        ...response,
        lti_message_hint: oidcData.body.lti_message_hint
      };
    } else {
      responseWithLTIMessageHint = { ...response };
    }
    //Save the OIDC Login Response to reference later during current session
    req.session.loginResponse = responseWithLTIMessageHint;
    res.redirect(
      url.format({
        pathname: "Need to eterd the Platform's OIDC Authorization endpoint",
        query: responseWithLTIMessageHint
      })
    );
  }
  if (errors.length > 0) {
    res.send("Error with OIDC process: " + errors);
  }
};

export { ltiInitiateOIDC };
