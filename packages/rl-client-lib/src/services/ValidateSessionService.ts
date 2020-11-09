import axios from "axios";
// eslint-disable-next-line node/no-extraneous-import
import { useLocation } from "react-router-dom";
import { API_URL, LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";
import queryString = require("query-string");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

const hasValidSession = async (): Promise<boolean> => {
  logger.debug(`hitting endpoint GET:${LTI_SESSION_VALIDATION_ENDPOINT}`);


  const location = useLocation();
  console.log(location.search);
  const parsed = queryString.parse(location.search);
  const platform = parsed.platform;
  if (platform) {
    const hasValidSession = await axios
      .get(API_URL + LTI_SESSION_VALIDATION_ENDPOINT + `?platform=${platform}`)
      .then((results) => {
        logger.debug(JSON.stringify(results));
        return results.data;
      });
    return hasValidSession.isValid;
  }
  return false;
};

export { hasValidSession };
