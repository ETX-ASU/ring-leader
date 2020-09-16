import url from "url";
import { getDecodedAccessToken } from "../util/getDecodedAccessToken";
import { validOAuth2Reponse } from "../util/auth";

class ProcessOAuth2 {
  LtiHandleOAuth2Response = (req: any, res: any): any => {
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
}
export { ProcessOAuth2 };
