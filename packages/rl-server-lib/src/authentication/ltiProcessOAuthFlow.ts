import url from "url";
import jwtDecode from "jwt-decode";

const validOAuth2Reponse = (
  oAuth2Data: any,
  validationParameters: any
): string[] => {
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
  if (oAuth2Data.nonce === validationParameters.nonce)
    errors.push("NOUNCE_DOES_NOT_MATCH");

  if (oAuth2Data.state === validationParameters.state)
    errors.push("STATE_DOES_NOT_MATCH");
  return errors;
};

const getDecodedAccessToken = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (Error) {
    return null;
  }
};

const LtiHandleOAuth2Response = (
  req: any,
  res: any,
  validationParameters: any
): any => {
  const oAuth2Data = req.body;

  const errors = ([] = validOAuth2Reponse(oAuth2Data, validationParameters));

  if (errors.length > 0) return errors;

  const tokenInfo = getDecodedAccessToken(oAuth2Data.token);
  const expireDate = tokenInfo.exp; // get token expiration dateTime
  console.log(tokenInfo);
  console.log(expireDate);

  res.redirect(
    url.format({
      pathname: req.target_link_uri,
      query: ""
    })
  );
};

export { LtiHandleOAuth2Response };
