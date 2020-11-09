import axios from "axios";
import {useParams, useLocation} from "react-router-dom";
import {API_URL, LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";

const params = new URLSearchParams(useLocation().search);
console.log(params.get("platform"));

const hasValidSession = async (): Promise<boolean> => {
  logger.debug(`hitting endpoint GET:${LTI_SESSION_VALIDATION_ENDPOINT}`);
  const hasValidSession = await axios
    .get(
      API_URL +
        LTI_SESSION_VALIDATION_ENDPOINT +
        `?platform=${params.get("platform")}`
    )
    .then((results) => {
      logger.debug(JSON.stringify(results));
      return results.data;
    });
  return hasValidSession.isValid;
};

export { hasValidSession };
