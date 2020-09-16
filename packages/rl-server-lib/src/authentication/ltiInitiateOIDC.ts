import url from "url";
import { generateUniqueString } from "../util/generateUniqueString";
import { isValidOIDCRequest } from "../util/auth";

const ltiInitiateOIDC = (req: any, res: any): any => {
  const oidcData = req.body;
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
