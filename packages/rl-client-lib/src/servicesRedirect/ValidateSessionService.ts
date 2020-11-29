import axios from "axios";
import { API_URL, LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";
import {startParamsWithHash} from '../utils/hashUtils';
const hasValidSession = async (): Promise<boolean> => {
  logger.debug(`hitting endpoint GET:${LTI_SESSION_VALIDATION_ENDPOINT}`);


    const hasValidSession = await axios
      .get(API_URL + LTI_SESSION_VALIDATION_ENDPOINT + startParamsWithHash())
      .then((results) => {
        logger.debug(JSON.stringify(results));
        return results.data;
      });
    return hasValidSession.isValid;

  return false;
};

export { hasValidSession };
