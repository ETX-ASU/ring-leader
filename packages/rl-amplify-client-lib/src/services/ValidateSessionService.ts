import API from "@aws-amplify/api";
API.configure();

import { LTI_API_NAME, LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";

const hasValidSession = async (): Promise<boolean> => {
  const hasValidSession = await API.get(
    LTI_API_NAME,
    LTI_SESSION_VALIDATION_ENDPOINT
  );

  return hasValidSession.isValid;
};

export { hasValidSession };
