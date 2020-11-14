import API from "@aws-amplify/api";
import { logger, DEEP_LINK_RESOURCELINKS_ENDPOINT, DEEP_LINK_ASSIGNMENT_ENDPOINT, LTI_API_NAME } from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';

const getDeepLinkResourceLinks = async () => {
  const links = await API.get(
    LTI_API_NAME, DEEP_LINK_RESOURCELINKS_ENDPOINT + startParamsWithHash(), null);
  return links;
};
const submitResourceSelection = async (
  resourceLink:any
) => {
  const data = {
    contentItems: [resourceLink],
    hash: getHash()
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