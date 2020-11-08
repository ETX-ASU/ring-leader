import API from "@aws-amplify/api";
API.configure();

import { DEEP_LINK_RESOURCELINKS_ENDPOINT, DEEP_LINK_ASSIGNMENT_ENDPOINT, LTI_API_NAME } from "@asu-etx/rl-shared";
import { logger, SubmitContentItem } from "@asu-etx/rl-shared";

const getDeepLinkResourceLinks = async (): Promise<any[]> => {
  const links = await API.get(LTI_API_NAME, DEEP_LINK_RESOURCELINKS_ENDPOINT);
  return links;
};
const submitResourceSelection = async (
  resourceLink: SubmitContentItem
): Promise<any> => {
  const data = {
    contentItems: [resourceLink]
};
  const assignment = await API.post(
    LTI_API_NAME,
    DEEP_LINK_ASSIGNMENT_ENDPOINT,
    data
  );
  logger.debug(`hitting endpoint POST:${DEEP_LINK_ASSIGNMENT_ENDPOINT}`);
  return assignment;
};

export { getDeepLinkResourceLinks, submitResourceSelection }