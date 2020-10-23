import axios from "axios";
import {DEEP_LINK_RESOURCELINKS_ENDPOINT, DEEP_LINK_ASSIGNMENT_ENDPOINT} from "@asu-etx/rl-shared";
import { logger } from "@asu-etx/rl-shared";

const getDeepLinkResourceLinks = async () : Promise<any[]>  => {
  logger.debug(`hitting endpoint GET:${DEEP_LINK_RESOURCELINKS_ENDPOINT}`);
  const links =  await axios.get(DEEP_LINK_RESOURCELINKS_ENDPOINT).then((results) => {
    logger.debug(JSON.stringify(results.data));
    return results.data;
  });
  return links;
};
const submitResourceSelection =  async (resourceLink: any)  : Promise<any>  => {
  logger.debug(`hitting endpoint POST:${DEEP_LINK_ASSIGNMENT_ENDPOINT}`);
  const assignment = await axios
    .post(DEEP_LINK_ASSIGNMENT_ENDPOINT, {
      contentItems: [resourceLink]
    })
    .then((result) => {
      logger.debug(result);
      return result.data;
    });
  return assignment;
};


export {getDeepLinkResourceLinks, submitResourceSelection}