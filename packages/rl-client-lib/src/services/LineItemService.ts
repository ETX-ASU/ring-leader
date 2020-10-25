import axios from "axios";
import { GET_ASSIGNMENT_ENDPOINT, DELETE_LINE_ITEM, LineItem, logger } from "@asu-etx/rl-shared";

const getLineItems = (): Promise<LineItem[]> => {
  logger.debug(`hitting endpoint GET:${GET_ASSIGNMENT_ENDPOINT}`);
  const results = axios.get(GET_ASSIGNMENT_ENDPOINT).then((results) => {
    logger.debug(JSON.stringify(results.data));
    if (results.data.length <= 0) {
      return [];
    }
    return results.data;
  });
  return results;
};

const deleteLineItem = (assignmentId: string): Promise<any> => {
  logger.debug(`hitting DELETE_LINE_ITEM: ${DELETE_LINE_ITEM}`);
  const results = axios
    .delete(DELETE_LINE_ITEM, {
      params: {
        lineItemId: assignmentId
      }
    })
    .then((results) => {
      logger.debug(`deleteLineItem: ${JSON.stringify(results.data)}`);
      return results.data;
    });
  return results;
}

export { getLineItems, deleteLineItem };