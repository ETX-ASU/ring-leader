import url from "url";
import { generateUniqueString } from "../util/generateUniqueString";
import { isValidOIDCRequest } from "../util/auth";
//import { setCookie } from "../util/cookie";

class ProcessOIDC {
  constructor() {
    console.log("This is ProcessOIDC() constructor");
  }
  ltiInitiateOIDC = (req: any, res: any): any => {
    const oidcData = req.query;
    console.log("Get Request query");
    console.log(req.query);
    const errors = ([] = isValidOIDCRequest(oidcData));
    if (errors.length === 0) {
      let responseWithLTIMessageHint = {};
      const response = {
        scope: "openid",
        response_type: "id_token",
        response_mode: "form_post",
        client_id: oidcData.client_id,
        redirect_uri: oidcData.target_link_uri,
        login_hint: oidcData.login_hint,
        state: generateUniqueString(30, true),
        nonce: generateUniqueString(25, false),
        prompt: "none"
      };
      if (oidcData.lti_message_hint) {
        responseWithLTIMessageHint = {
          ...response,
          lti_message_hint: oidcData.lti_message_hint
        };
      } else {
        responseWithLTIMessageHint = { ...response };
      }

      if (oidcData.lti_deployment_id)
        responseWithLTIMessageHint = {
          ...responseWithLTIMessageHint,
          lti_deployment_id: oidcData.lti_deployment_id
        };
      // setCookie("nonce", response.nonce);
      // setCookie("state", response.state);
      // setCookie("client_id", response.client_id);
      console.log("responseWithLTIMessageHint");
      console.log(responseWithLTIMessageHint);
      //return responseWithLTIMessageHint;
      res.redirect(
        url.format({
          pathname:
            "https://lti-ri.imsglobal.org/platforms/1285/authorizations/new",
          query: responseWithLTIMessageHint
        })
      );
    }
    if (errors.length > 0) {
      res.send("Error with OIDC process: " + errors);
    }
  };
}
export { ProcessOIDC };
