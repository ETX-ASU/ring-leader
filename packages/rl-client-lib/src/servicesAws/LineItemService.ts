import API from '@aws-amplify/api';
import { GET_ASSIGNMENT_ENDPOINT, DELETE_LINE_ITEM, LTI_API_NAME, logger } from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';

const getLineItems = async () => {
  logger.debug(`hitting endpoint GET:${GET_ASSIGNMENT_ENDPOINT}`);
  const lineItems = await API.get(LTI_API_NAME, 
    GET_ASSIGNMENT_ENDPOINT + startParamsWithHash(), null);
    return lineItems;
};

const deleteLineItem = async (assignmentId: any) => {
  const results = await API.del(LTI_API_NAME, DELETE_LINE_ITEM, {
    lineItemId: assignmentId,
    hash: getHash()
  });

  return results;
}

export { getLineItems, deleteLineItem };