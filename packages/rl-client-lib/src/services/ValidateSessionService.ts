import axios from "axios";
// eslint-disable-next-line node/no-extraneous-import
import { useLocation } from "react-router-dom";
import {API_URL, LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const hasValidSession = async (): Promise<boolean> => {
  logger.debug(`hitting endpoint GET:${LTI_SESSION_VALIDATION_ENDPOINT}`);
  const params = useQuery();
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
