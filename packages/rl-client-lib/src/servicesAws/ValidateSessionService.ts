import API from "@aws-amplify/api";
import { LTI_SESSION_VALIDATION_ENDPOINT } from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';
const LTI_API_NAME = "ringleaderapi";
const hasValidSession = async () => {
  const hasValidSession = await API.get(
    LTI_API_NAME,
    LTI_SESSION_VALIDATION_ENDPOINT+ startParamsWithHash(),null
  );
  console.log(`hasValidSession: ${JSON.stringify(hasValidSession)}`);
  return hasValidSession.isValid;
};

export { hasValidSession };
