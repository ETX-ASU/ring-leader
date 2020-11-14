import API from "@aws-amplify/api";
import { LTI_API_NAME, ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT, 
  GET_ASSIGNED_STUDENTS_ENDPOINT, logger } from "@asu-etx/rl-shared";
import {getHash, startParamsWithHash} from '../utils/hashUtils';


const getUsers = async (aws_exports:any, role: string)  => {
  API.configure(aws_exports);
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const users = await API.get(LTI_API_NAME, `${ROSTER_ENDPOINT}?role=${role}`
    /*`${ROSTER_ENDPOINT}${startParamsWithHash()}&role=${role}`*/, null);
  return users;
};

const getUnassignedStudents = async (
  aws_exports: any,
  assignmentId: string,
  resourceLinkId: string
) => {
  API.configure(aws_exports);
  const uanssignedStudents = await API.get(LTI_API_NAME,
    `${GET_UNASSIGNED_STUDENTS_ENDPOINT}?lineItemId=${assignmentId}&resourceLinkId=${resourceLinkId}`
  ,null);
  return uanssignedStudents;
};

const getAssignedStudents = async (
  aws_exports:any,
  assignmentId: string,
  resourceLinkId: string
) => {
  API.configure(aws_exports);
  const uanssignedStudents = await API.get(LTI_API_NAME, GET_ASSIGNED_STUDENTS_ENDPOINT + window.location.search, {
      lineItemId: assignmentId,
      resourceLinkId: resourceLinkId
  });
  return uanssignedStudents;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };
