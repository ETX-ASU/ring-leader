import { inspect } from "util";
import { rlValidateDecodedToken, rlDecodeIdToken } from "./auth";

import { rlPlatform } from "../util/rlPlatform";
import { getToolConsumer } from "../services/ToolConsumerService";

const processRequest = async (request: any) => {
  if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }

  const session = request.session;

  const decodedToken = rlDecodeIdToken(request.body.id_token);
  rlValidateDecodedToken(decodedToken, session);
  const platformDetails = await getToolConsumer({
    name: "",
    client_id: decodedToken["aud"],
    iss: decodedToken["iss"],
    deployment_id:
      decodedToken["https://purl.imsglobal.org/spec/lti/claim/deployment_id"]
  });

  if (platformDetails == undefined) {
    return;
  }

  const platform = rlPlatform(
    platformDetails.private_key,
    platformDetails.platformOIDCAuthEndPoint,
    platformDetails.platformAccessTokenEndpoint,
    platformDetails.keyid,
    platformDetails.alg,
    request.body.id_token
  );

  return { rlPlatform: platform, session: session };
};

export default processRequest;
