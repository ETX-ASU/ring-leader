import { rlValidateDecodedToken, rlDecodeIdToken } from "../util/auth";
import { getToolConsumer } from "../services/ToolConsumerService";
import { DEPLOYMENT_ID_CLAIM } from "@asu-etx/rl-shared";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const validateSession = async (session: any) => {
  if (!session) {
    return false;
  }

  if (!session.platform) {
    return false;
  }
  const platform = session.platform;
  const decodedToken = rlDecodeIdToken(platform.token);
  rlValidateDecodedToken(decodedToken, session);
  const platformDetails = getToolConsumer({
    name: "",
    client_id: decodedToken["aud"],
    iss: decodedToken["iss"],
    deployment_id: decodedToken[DEPLOYMENT_ID_CLAIM]
  });

  if (platformDetails == undefined) {
    return false;
  }

  return true;
};

export default validateSession;
