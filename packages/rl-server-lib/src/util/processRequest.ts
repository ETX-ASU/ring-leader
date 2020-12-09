import { rlValidateDecodedToken, rlDecodeIdToken } from "./auth";

import { rlPlatform } from "../util/rlPlatform";
import { getToolConsumer } from "../services/ToolConsumerService";
import { DEPLOYMENT_ID_CLAIM, logger } from "@asu-etx/rl-shared";

const processRequest = async (request: any) => {
  if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }

  const session = request.session;

  const decodedToken = rlDecodeIdToken(request.body.id_token);
  rlValidateDecodedToken(decodedToken, session);
  const platformDetails = getToolConsumer({
    client_id: decodedToken["aud"],
    iss: decodedToken["iss"],
    deployment_id: decodedToken[DEPLOYMENT_ID_CLAIM]
  });
  logger.debug(`Tool Consumer found: ${JSON.stringify(platformDetails)} `)
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
