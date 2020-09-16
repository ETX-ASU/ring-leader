import url from "url";
import { getDecodedAccessToken } from "../util/getDecodedAccessToken";
import { validOAuth2Reponse } from "../util/auth";

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
