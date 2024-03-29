import API from '@aws-amplify/api';
import { GET_ASSIGNMENT_ENDPOINT, DELETE_LINE_ITEM, LTI_API_NAME, logger } from "@asu-etx/rl-shared";
import { getHash } from '../utils/hashUtils';
const getLineItems = async (aws_exports: any) => {
  API.configure(aws_exports);
  logger.debug(`hitting endpoint GET:${GET_ASSIGNMENT_ENDPOINT}`);
  const lineItems = await API.get(LTI_API_NAME,
    GET_ASSIGNMENT_ENDPOINT, { queryStringParameters: { hash: getHash() } });
  return lineItems;
};

const deleteLineItem = async (aws_exports: any, assignmentId: any) => {
  API.configure(aws_exports);
  const results = await API.del(LTI_API_NAME, DELETE_LINE_ITEM,
    {
      queryStringParameters: {
        lineItemId: assignmentId,
        hash: getHash()
      }
    });

  return results;
}

export { getLineItems, deleteLineItem };