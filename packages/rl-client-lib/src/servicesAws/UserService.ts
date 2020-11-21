import API from "@aws-amplify/api";
import {
  LTI_API_NAME, ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT,
  GET_ASSIGNED_STUDENTS_ENDPOINT, logger
} from "@asu-etx/rl-shared";
import { getHash, startParamsWithHash } from '../utils/hashUtils';
//import aws_exports from '../aws-exports'


const getUsers = async (aws_exports: any, role: string) => {
  API.configure(aws_exports);
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const users = await API.get(LTI_API_NAME,
    ROSTER_ENDPOINT,
    {queryStringParameters: {
      role: role,
      hash: getHash()
    }});
  return users;
};

const getUnassignedStudents = async (
  aws_exports: any,
  assignmentId: string,
  resourceLinkId: string
) => {
  API.configure(aws_exports);
  const uanssignedStudents = await API.get(LTI_API_NAME,
    GET_UNASSIGNED_STUDENTS_ENDPOINT,
    {queryStringParameters: {
      lineItemId: assignmentId,
      resourceLinkId: resourceLinkId,
      hash: getHash()
    }}
  );
  return uanssignedStudents;
};

const getAssignedStudents = async (
  aws_exports: any,
  assignmentId: string,
  resourceLinkId: string
) => {
  API.configure(aws_exports);
  const uanssignedStudents = await API.get(LTI_API_NAME, GET_ASSIGNED_STUDENTS_ENDPOINT, 
    {queryStringParameters: {
    lineItemId: assignmentId,
    resourceLinkId: resourceLinkId,
    hash: getHash()
  }});
  return uanssignedStudents;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };
