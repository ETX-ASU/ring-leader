import url from "url";
import jwtDecode from "jwt-decode";

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

  return errors;
};

const getDecodedAccessToken = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (Error) {
    return null;
  }
};

const LtiHandleOAuth2Response = (req: any, res: any): any => {
  const oAuth2Data = req.body;

  const errors = ([] = validOAuth2Reponse(oAuth2Data));

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
