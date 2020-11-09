import axios from "axios";

import {API_URL, LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";

const hasValidSession = async (): Promise<boolean> => {
  logger.debug(`hitting endpoint GET:${LTI_SESSION_VALIDATION_ENDPOINT}`);
  const hasValidSession = await axios
    .get(API_URL + LTI_SESSION_VALIDATION_ENDPOINT)
    .then((results) => {
      logger.debug(JSON.stringify(results));
      return results.data;
    });
  return hasValidSession.isValid;
};

export { hasValidSession };
