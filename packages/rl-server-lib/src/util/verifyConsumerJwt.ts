import { getToolConsumer } from "../services/ToolConsumerService";
import jwt from "jsonwebtoken";
import axios from "axios";
import { DEPLOYMENT_ID_CLAIM } from "@asu-etx/rl-shared/build/util/lti_claims";

const verifyConsumerJwt = async (token: string, decodedToken: any,): Promise<boolean> => {
  const kid = decodedToken.header.kid ? decodedToken.header.kid : decodedToken.header.keyid;
  const consumerTool = getToolConsumer({ iss: decodedToken.iss, client_id: decodedToken.aud, deployment_id: decodedToken[DEPLOYMENT_ID_CLAIM] });
  if (!consumerTool) {
    return false;
  }
  if (consumerTool.platformPublicJWKEndpoint && consumerTool.platformPublicJWKEndpoint != "not required: one or the other of platformPublicKey/platformPublicJWKEndpoint") {
    const response = await axios.get(consumerTool.platformPublicJWKEndpoint);
    const jwks = response.data.filter((jwk: any) => { return jwk.kid == kid || jwk.keyid == kid });
    if (!jwks || jwks.length != 1) {
      return false;
    }
    jwt.verify(token, jwks[0]);

  } else {
    if (consumerTool.platformPublicKey && consumerTool.platformPublicKey != "not required: one or the other of platformPublicKey/platformPublicJWKEndpoint") {
      jwt.verify(token, consumerTool.platformPublicKey);
    } else {
      return false;
    }
  }
  return true;
}

export default verifyConsumerJwt;
