import axios from "axios";
import {DEEP_LINK_RESOURCELINKS_ENDPOINT, DEEP_LINK_ASSIGNMENT_ENDPOINT} from "@asu-etx/rl-shared";

const getDeepLinkResourceLinks = async () : Promise<any[]>  => {
  console.log(`hitting endpoint GET:${DEEP_LINK_RESOURCELINKS_ENDPOINT}`);
  const links =  await axios.get(DEEP_LINK_RESOURCELINKS_ENDPOINT).then((results) => {
    console.log(JSON.stringify(results.data));
    return results.data;
  });
  return links;
};
const submitResourceSelection =  async (resourceLink: any)  : Promise<any>  => {
  console.log(`hitting endpoint POST:${DEEP_LINK_ASSIGNMENT_ENDPOINT}`);
  const assignment = await axios
    .post(DEEP_LINK_ASSIGNMENT_ENDPOINT, {
      contentItems: [resourceLink]
    })
    .then((result) => {
      console.log(result);
      return result.data;
    });
  return assignment;
};


export {getDeepLinkResourceLinks, submitResourceSelection}