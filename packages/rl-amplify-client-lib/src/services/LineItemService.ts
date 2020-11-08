import API from '@aws-amplify/api';
API.configure();
import { GET_ASSIGNMENT_ENDPOINT, DELETE_LINE_ITEM, LTI_API_NAME, LineItem, logger } from "@asu-etx/rl-shared";

const getLineItems = (): Promise<LineItem[]> => {
  logger.debug(`hitting endpoint GET:${GET_ASSIGNMENT_ENDPOINT}`);
  const lineItems = await API.get(LTI_API_NAME, GET_ASSIGNMENT_ENDPOINT);
    return lineItems;
};

const deleteLineItem = async (assignmentId: string): Promise<any> => {
  const results = await API.delete(LTI_API_NAME, DELETE_LINE_ITEM, {
    lineItemId: assignmentId
  });

  return results;
}

export { getLineItems, deleteLineItem };