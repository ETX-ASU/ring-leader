import axios from "axios";
import { API_URL, DEEP_LINK_RESOURCELINKS_ENDPOINT, DEEP_LINK_ASSIGNMENT_ENDPOINT } from "@asu-etx/rl-shared";
import { logger, SubmitContentItem } from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';

const getDeepLinkResourceLinks = async (): Promise<any[]> => {
  logger.debug(`hitting endpoint GET:${DEEP_LINK_RESOURCELINKS_ENDPOINT}`);
  const links = await axios.get(API_URL + DEEP_LINK_RESOURCELINKS_ENDPOINT + startParamsWithHash()).then((results) => {
    logger.debug(JSON.stringify(results.data));
    return results.data;
  });
  return links;
};
const submitResourceSelection = async (
  resourceLink: SubmitContentItem
): Promise<any> => {
  logger.debug(`hitting endpoint POST:${DEEP_LINK_ASSIGNMENT_ENDPOINT}`);
  const assignment = await axios
    .post(API_URL + DEEP_LINK_ASSIGNMENT_ENDPOINT, {
      contentItems: [resourceLink],
      hash: getHash()
    })
    .then((result) => {
      logger.debug(result);
      return result.data;
    });
  return assignment;
};

export { getDeepLinkResourceLinks, submitResourceSelection }